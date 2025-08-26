#!/usr/bin/env python3
"""
Git Repository Analysis Tool
Analyzes a git repository to find:
- Number of Java classes and main Java classes
- Number of shell scripts
- Cron job schedules and timings
- Number of stored procedures
"""

import os
import re
import sys
import argparse
import csv
from pathlib import Path
from typing import List, Dict, Tuple
import subprocess
from collections import defaultdict
from datetime import datetime

class GitRepoAnalyzer:
    """Main analyzer class for git repository analysis"""
    
    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path).resolve()
        self.java_classes = []
        self.main_classes = []
        self.shell_scripts = []
        self.cron_jobs = []
        self.stored_procedures = []
        
        # File extensions to look for
        self.java_extensions = {'.java'}
        self.shell_extensions = {'.sh', '.bash', '.zsh', '.ksh', '.csh'}
        self.sql_extensions = {'.sql', '.proc','.prc' '.sp', '.plsql'}
        self.cron_files = {'crontab', 'cron', 'crontab.txt'}
        
    def is_git_repo(self) -> bool:
        """Check if the given path is a git repository"""
        return (self.repo_path / '.git').exists()
    
    def analyze_repository(self) -> Dict:
        """Main method to analyze the entire repository"""
        if not self.repo_path.exists():
            raise FileNotFoundError(f"Repository path does not exist: {self.repo_path}")
            
        print(f"Analyzing repository at: {self.repo_path}")
        print("-" * 60)
        
        # Walk through all files in the repository
        for root, dirs, files in os.walk(self.repo_path):
            # Skip .git directory and other version control directories
            dirs[:] = [d for d in dirs if not d.startswith('.git') and d != 'node_modules' and d != 'target']
            
            current_path = Path(root)
            for file in files:
                file_path = current_path / file
                self._analyze_file(file_path)
        
        return self._generate_report()
    
    def _analyze_file(self, file_path: Path):
        """Analyze a single file based on its extension and content"""
        file_ext = file_path.suffix.lower()
        file_name = file_path.name.lower()
        
        try:
            # Java files
            if file_ext in self.java_extensions:
                self._analyze_java_file(file_path)
            
            # Shell scripts
            elif file_ext in self.shell_extensions or self._is_shell_script(file_path):
                self.shell_scripts.append(file_path)
            
            # SQL/Stored procedures
            elif file_ext in self.sql_extensions:
                self._analyze_sql_file(file_path)
            
            # Cron files
            elif file_name in self.cron_files or 'cron' in file_name:
                self._analyze_cron_file(file_path)
                
        except Exception as e:
            print(f"Warning: Could not analyze file {file_path}: {e}")
    
    def _analyze_java_file(self, file_path: Path):
        """Analyze Java file for classes and main methods"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Find Java classes
            class_pattern = r'\b(?:public\s+|private\s+|protected\s+)?(?:abstract\s+|final\s+)?class\s+(\w+)'
            classes = re.findall(class_pattern, content, re.MULTILINE)
            
            for class_name in classes:
                self.java_classes.append({
                    'name': class_name,
                    'file': str(file_path),
                    'relative_path': str(file_path.relative_to(self.repo_path))
                })
            
            # Check for main method
            main_pattern = r'\bpublic\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w*\s*\)'
            if re.search(main_pattern, content, re.MULTILINE | re.IGNORECASE):
                self.main_classes.append({
                    'file': str(file_path),
                    'relative_path': str(file_path.relative_to(self.repo_path)),
                    'classes': classes
                })
                
        except Exception as e:
            print(f"Error analyzing Java file {file_path}: {e}")
    
    def _is_shell_script(self, file_path: Path) -> bool:
        """Check if file is a shell script by examining shebang"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                first_line = f.readline().strip()
                return first_line.startswith('#!') and any(shell in first_line for shell in ['sh', 'bash', 'zsh', 'ksh', 'csh'])
        except:
            return False
    
    def _analyze_sql_file(self, file_path: Path):
        """Analyze SQL file for stored procedures"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().upper()
            
            # Look for stored procedure definitions
            proc_patterns = [
                r'CREATE\s+(?:OR\s+REPLACE\s+)?PROCEDURE\s+(\w+)',
                r'CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(\w+)',
                r'DELIMITER\s*\$\$\s*CREATE\s+(?:OR\s+REPLACE\s+)?PROCEDURE\s+(\w+)',
                r'CREATE\s+(?:OR\s+REPLACE\s+)?PACKAGE\s+(\w+)'
            ]
            
            procedures = []
            for pattern in proc_patterns:
                matches = re.findall(pattern, content, re.MULTILINE | re.IGNORECASE)
                procedures.extend(matches)
            
            if procedures:
                self.stored_procedures.append({
                    'file': str(file_path),
                    'relative_path': str(file_path.relative_to(self.repo_path)),
                    'procedures': procedures,
                    'count': len(procedures)
                })
                
        except Exception as e:
            print(f"Error analyzing SQL file {file_path}: {e}")
    
    def _analyze_cron_file(self, file_path: Path):
        """Analyze cron file for scheduled jobs"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            
            jobs = []
            for line_num, line in enumerate(lines, 1):
                line = line.strip()
                
                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    continue
                
                # Basic cron pattern: minute hour day month dayofweek command
                cron_pattern = r'^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$'
                match = re.match(cron_pattern, line)
                
                if match:
                    minute, hour, day, month, dayofweek, command = match.groups()
                    jobs.append({
                        'line': line_num,
                        'schedule': f"{minute} {hour} {day} {month} {dayofweek}",
                        'command': command.strip(),
                        'timing_description': self._describe_cron_timing(minute, hour, day, month, dayofweek)
                    })
            
            if jobs:
                self.cron_jobs.append({
                    'file': str(file_path),
                    'relative_path': str(file_path.relative_to(self.repo_path)),
                    'jobs': jobs,
                    'count': len(jobs)
                })
                
        except Exception as e:
            print(f"Error analyzing cron file {file_path}: {e}")
    
    def _describe_cron_timing(self, minute: str, hour: str, day: str, month: str, dayofweek: str) -> str:
        """Convert cron timing to human-readable description"""
        def format_field(value: str, field_type: str) -> str:
            if value == '*':
                return f"every {field_type}"
            elif '/' in value:
                return f"every {value.split('/')[1]} {field_type}s"
            elif '-' in value:
                return f"{field_type}s {value}"
            elif ',' in value:
                return f"{field_type}s {value}"
            else:
                return f"{field_type} {value}"
        
        parts = []
        if minute != '*':
            parts.append(format_field(minute, 'minute'))
        if hour != '*':
            parts.append(format_field(hour, 'hour'))
        if day != '*':
            parts.append(format_field(day, 'day'))
        if month != '*':
            parts.append(format_field(month, 'month'))
        if dayofweek != '*':
            parts.append(format_field(dayofweek, 'weekday'))
        
        if not parts:
            return "every minute"
        return ", ".join(parts)
    
    def _generate_report(self) -> Dict:
        """Generate comprehensive analysis report"""
        total_stored_procedures = sum(sp['count'] for sp in self.stored_procedures)
        total_cron_jobs = sum(cf['count'] for cf in self.cron_jobs)
        
        report = {
            'repository_path': str(self.repo_path),
            'java_analysis': {
                'total_java_classes': len(self.java_classes),
                'total_main_classes': len(self.main_classes),
                'java_classes': self.java_classes,
                'main_classes': self.main_classes
            },
            'shell_analysis': {
                'total_shell_scripts': len(self.shell_scripts),
                'shell_scripts': [{'file': str(script), 'relative_path': str(script.relative_to(self.repo_path))} 
                                for script in self.shell_scripts]
            },
            'cron_analysis': {
                'total_cron_jobs': total_cron_jobs,
                'cron_files_found': len(self.cron_jobs),
                'cron_details': self.cron_jobs
            },
            'sql_analysis': {
                'total_stored_procedures': total_stored_procedures,
                'sql_files_with_procedures': len(self.stored_procedures),
                'stored_procedure_details': self.stored_procedures
            }
        }
        
        return report
    
    def print_report(self, report: Dict):
        """Print a formatted report to console"""
        print("\n" + "=" * 80)
        print("GIT REPOSITORY ANALYSIS REPORT")
        print("=" * 80)
        print(f"Repository: {report['repository_path']}")
        print()
        
        # Java Analysis
        java = report['java_analysis']
        print("📁 JAVA ANALYSIS")
        print("-" * 40)
        print(f"Total Java Classes: {java['total_java_classes']}")
        print(f"Classes with main() method: {java['total_main_classes']}")
        
        if java['main_classes']:
            print("\nMain Classes Details:")
            for main_class in java['main_classes']:
                print(f"  • {main_class['relative_path']}")
                if main_class['classes']:
                    print(f"    Classes: {', '.join(main_class['classes'])}")
        print()
        
        # Shell Scripts Analysis
        shell = report['shell_analysis']
        print("🐚 SHELL SCRIPTS ANALYSIS")
        print("-" * 40)
        print(f"Total Shell Scripts: {shell['total_shell_scripts']}")
        
        if shell['shell_scripts']:
            print("\nShell Scripts Found:")
            for script in shell['shell_scripts'][:10]:  # Show first 10
                print(f"  • {script['relative_path']}")
            if len(shell['shell_scripts']) > 10:
                print(f"  ... and {len(shell['shell_scripts']) - 10} more")
        print()
        
        # Cron Analysis
        cron = report['cron_analysis']
        print("⏰ CRON JOBS ANALYSIS")
        print("-" * 40)
        print(f"Total Cron Jobs: {cron['total_cron_jobs']}")
        print(f"Cron Files Found: {cron['cron_files_found']}")
        
        if cron['cron_details']:
            print("\nCron Jobs Details:")
            for cron_file in cron['cron_details']:
                print(f"\n  File: {cron_file['relative_path']}")
                for job in cron_file['jobs']:
                    print(f"    • Schedule: {job['schedule']}")
                    print(f"      Timing: {job['timing_description']}")
                    print(f"      Command: {job['command'][:60]}{'...' if len(job['command']) > 60 else ''}")
        print()
        
        # SQL Analysis
        sql = report['sql_analysis']
        print("🗄️  STORED PROCEDURES ANALYSIS")
        print("-" * 40)
        print(f"Total Stored Procedures: {sql['total_stored_procedures']}")
        print(f"SQL Files with Procedures: {sql['sql_files_with_procedures']}")
        
        if sql['stored_procedure_details']:
            print("\nStored Procedures Details:")
            for sql_file in sql['stored_procedure_details']:
                print(f"\n  File: {sql_file['relative_path']}")
                print(f"  Procedures: {', '.join(sql_file['procedures'])}")
        
        print("\n" + "=" * 80)
    
    def export_to_csv(self, report: Dict, output_dir: str = "analysis_results"):
        """Export analysis results to CSV files"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Export Java classes
        self._export_java_classes_csv(report, output_path, timestamp)
        
        # Export cron jobs
        self._export_cron_jobs_csv(report, output_path, timestamp)
        
        # Export stored procedures
        self._export_stored_procedures_csv(report, output_path, timestamp)
        
        # Export summary
        self._export_summary_csv(report, output_path, timestamp)
        
        print(f"\nCSV files exported to: {output_path.absolute()}")
        return output_path
    
    def _export_java_classes_csv(self, report: Dict, output_path: Path, timestamp: str):
        """Export Java classes to CSV"""
        filename = f"java_classes_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['class_name', 'file_path', 'relative_path', 'has_main_method', 'package_path']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            java_analysis = report['java_analysis']
            main_class_files = {mc['file'] for mc in java_analysis['main_classes']}
            
            for java_class in java_analysis['java_classes']:
                # Extract package path from relative path
                rel_path = java_class['relative_path']
                package_path = str(Path(rel_path).parent) if Path(rel_path).parent != Path('.') else 'default'
                
                writer.writerow({
                    'class_name': java_class['name'],
                    'file_path': java_class['file'],
                    'relative_path': java_class['relative_path'],
                    'has_main_method': java_class['file'] in main_class_files,
                    'package_path': package_path
                })
        
        print(f"Java classes exported to: {filename}")
    
    def _export_cron_jobs_csv(self, report: Dict, output_path: Path, timestamp: str):
        """Export cron jobs to CSV"""
        filename = f"cron_jobs_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['cron_file', 'relative_path', 'line_number', 'schedule', 'minute', 'hour', 'day', 'month', 'dayofweek', 'command', 'timing_description']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            cron_analysis = report['cron_analysis']
            
            for cron_file in cron_analysis['cron_details']:
                for job in cron_file['jobs']:
                    schedule_parts = job['schedule'].split()
                    if len(schedule_parts) >= 5:
                        minute, hour, day, month, dayofweek = schedule_parts[:5]
                    else:
                        minute = hour = day = month = dayofweek = 'N/A'
                    
                    writer.writerow({
                        'cron_file': Path(cron_file['file']).name,
                        'relative_path': cron_file['relative_path'],
                        'line_number': job['line'],
                        'schedule': job['schedule'],
                        'minute': minute,
                        'hour': hour,
                        'day': day,
                        'month': month,
                        'dayofweek': dayofweek,
                        'command': job['command'],
                        'timing_description': job['timing_description']
                    })
        
        print(f"Cron jobs exported to: {filename}")
    
    def _export_stored_procedures_csv(self, report: Dict, output_path: Path, timestamp: str):
        """Export stored procedures to CSV"""
        filename = f"stored_procedures_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['sql_file', 'relative_path', 'procedure_name', 'procedure_type', 'file_extension']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            sql_analysis = report['sql_analysis']
            
            for sql_file in sql_analysis['stored_procedure_details']:
                file_path = Path(sql_file['file'])
                file_extension = file_path.suffix
                
                for procedure in sql_file['procedures']:
                    # Try to determine procedure type based on common patterns
                    procedure_type = 'PROCEDURE'
                    if 'FUNCTION' in procedure.upper():
                        procedure_type = 'FUNCTION'
                    elif 'PACKAGE' in procedure.upper():
                        procedure_type = 'PACKAGE'
                    
                    writer.writerow({
                        'sql_file': file_path.name,
                        'relative_path': sql_file['relative_path'],
                        'procedure_name': procedure,
                        'procedure_type': procedure_type,
                        'file_extension': file_extension
                    })
        
        print(f"Stored procedures exported to: {filename}")
    
    def _export_summary_csv(self, report: Dict, output_path: Path, timestamp: str):
        """Export summary statistics to CSV"""
        filename = f"analysis_summary_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['metric', 'count', 'details']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            # Java metrics
            java_analysis = report['java_analysis']
            writer.writerow({
                'metric': 'Total Java Classes',
                'count': java_analysis['total_java_classes'],
                'details': f"Found in {len(set(jc['file'] for jc in java_analysis['java_classes']))} files"
            })
            
            writer.writerow({
                'metric': 'Classes with main() method',
                'count': java_analysis['total_main_classes'],
                'details': f"Entry point classes for applications"
            })
            
            # Shell script metrics
            shell_analysis = report['shell_analysis']
            writer.writerow({
                'metric': 'Total Shell Scripts',
                'count': shell_analysis['total_shell_scripts'],
                'details': f"Scripts with various extensions (.sh, .bash, etc.)"
            })
            
            # Cron job metrics
            cron_analysis = report['cron_analysis']
            writer.writerow({
                'metric': 'Total Cron Jobs',
                'count': cron_analysis['total_cron_jobs'],
                'details': f"Found in {cron_analysis['cron_files_found']} cron files"
            })
            
            # SQL metrics
            sql_analysis = report['sql_analysis']
            writer.writerow({
                'metric': 'Total Stored Procedures',
                'count': sql_analysis['total_stored_procedures'],
                'details': f"Found in {sql_analysis['sql_files_with_procedures']} SQL files"
            })
            
            # Repository info
            writer.writerow({
                'metric': 'Repository Path',
                'count': 1,
                'details': report['repository_path']
            })
            
            writer.writerow({
                'metric': 'Analysis Timestamp',
                'count': 1,
                'details': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
        
        print(f"Summary statistics exported to: {filename}")


def main():
    """Main function to run the analyzer"""
    parser = argparse.ArgumentParser(description='Analyze git repository for Java classes, shell scripts, cron jobs, and stored procedures')
    parser.add_argument('repo_path', nargs='?', default='.', help='Path to git repository (default: current directory)')
    parser.add_argument('--output', '-o', help='Output file to save report (optional)')
    parser.add_argument('--format', '-f', choices=['text', 'json', 'csv'], default='text', help='Output format')
    parser.add_argument('--csv-dir', default='analysis_results', help='Directory to save CSV files (default: analysis_results)')
    parser.add_argument('--export-csv', action='store_true', help='Export results to CSV files in addition to chosen format')
    
    args = parser.parse_args()
    
    try:
        analyzer = GitRepoAnalyzer(args.repo_path)
        report = analyzer.analyze_repository()
        
        # Handle different output formats
        if args.format == 'text':
            analyzer.print_report(report)
        elif args.format == 'json':
            import json
            json_output = json.dumps(report, indent=2, default=str)
            if args.output:
                with open(args.output, 'w') as f:
                    f.write(json_output)
                print(f"JSON report saved to {args.output}")
            else:
                print(json_output)
        elif args.format == 'csv':
            # If CSV format is chosen, export to CSV files
            analyzer.export_to_csv(report, args.csv_dir)
        
        # Handle text output to file
        if args.output and args.format == 'text':
            with open(args.output, 'w') as f:
                # Redirect print to file
                import sys
                old_stdout = sys.stdout
                sys.stdout = f
                analyzer.print_report(report)
                sys.stdout = old_stdout
            print(f"Text report saved to {args.output}")
        
        # Export CSV files if requested (in addition to main format)
        if args.export_csv and args.format != 'csv':
            print("\n" + "=" * 60)
            print("EXPORTING ADDITIONAL CSV FILES...")
            print("=" * 60)
            analyzer.export_to_csv(report, args.csv_dir)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
