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
        
        # Enhanced cron job tracking
        self.unique_cron_commands = set()
        self.unique_schedules = set()
        self.unique_job_combinations = set()
        self.cron_command_frequency = defaultdict(int)
        self.schedule_frequency = defaultdict(int)
        
        # Shell script scheduling tracking
        self.scheduled_shell_scripts = set()
        self.shell_script_schedules = defaultdict(list)
        self.shell_script_frequency = defaultdict(int)
        self.shell_script_cron_jobs = []
        
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
                    schedule = f"{minute} {hour} {day} {month} {dayofweek}"
                    command_clean = command.strip()
                    
                    # Normalize command for uniqueness analysis
                    normalized_command = self._normalize_command(command_clean)
                    
                    # Track unique elements
                    self.unique_cron_commands.add(normalized_command)
                    self.unique_schedules.add(schedule)
                    job_combination = f"{schedule}||{normalized_command}"
                    self.unique_job_combinations.add(job_combination)
                    
                    # Track frequency
                    self.cron_command_frequency[normalized_command] += 1
                    self.schedule_frequency[schedule] += 1
                    
                    # Check if this is a shell script and track it
                    shell_script_info = self._extract_shell_script_info(command_clean)
                    
                    job_data = {
                        'line': line_num,
                        'schedule': schedule,
                        'command': command_clean,
                        'normalized_command': normalized_command,
                        'timing_description': self._describe_cron_timing(minute, hour, day, month, dayofweek),
                        'is_shell_script': shell_script_info['is_shell_script'],
                        'shell_script_path': shell_script_info['script_path'],
                        'shell_script_name': shell_script_info['script_name']
                    }
                    
                    if shell_script_info['is_shell_script']:
                        script_path = shell_script_info['script_path']
                        script_name = shell_script_info['script_name']
                        
                        self.scheduled_shell_scripts.add(script_path)
                        self.shell_script_schedules[script_path].append(schedule)
                        self.shell_script_frequency[script_path] += 1
                        self.shell_script_cron_jobs.append({
                            'script_path': script_path,
                            'script_name': script_name,
                            'schedule': schedule,
                            'timing_description': self._describe_cron_timing(minute, hour, day, month, dayofweek),
                            'cron_file': str(file_path),
                            'line': line_num,
                            'full_command': command_clean
                        })
                    
                    jobs.append(job_data)
            
            if jobs:
                self.cron_jobs.append({
                    'file': str(file_path),
                    'relative_path': str(file_path.relative_to(self.repo_path)),
                    'jobs': jobs,
                    'count': len(jobs)
                })
                
        except Exception as e:
            print(f"Error analyzing cron file {file_path}: {e}")
    
    def _normalize_command(self, command: str) -> str:
        """Normalize command for uniqueness analysis"""
        # Remove leading/trailing whitespace
        normalized = command.strip()
        
        # Remove multiple spaces and replace with single space
        normalized = re.sub(r'\s+', ' ', normalized)
        
        # Extract the base command (first word) and script name if it's a script
        parts = normalized.split()
        if parts:
            first_part = parts[0]
            
            # If it's a common interpreter, get the script name
            if first_part.lower() in ['python', 'python3', 'bash', 'sh', '/bin/bash', '/bin/sh', 'perl', 'php']:
                if len(parts) > 1:
                    script_path = parts[1]
                    # Get just the script name without path
                    script_name = Path(script_path).name
                    # Return interpreter + script name
                    return f"{first_part} {script_name}"
            
            # If it's a direct script execution, get just the script name
            elif first_part.startswith('/') or first_part.startswith('./'):
                script_name = Path(first_part).name
                return script_name
            
            # For other commands, keep the base command
            else:
                return first_part
        
        return normalized
    
    def _extract_shell_script_info(self, command: str) -> Dict:
        """Extract shell script information from a cron command"""
        info = {
            'is_shell_script': False,
            'script_path': None,
            'script_name': None
        }
        
        # Clean up the command
        command_clean = command.strip()
        parts = command_clean.split()
        
        if not parts:
            return info
        
        # Check for direct shell script execution
        first_part = parts[0]
        
        # Case 1: Direct execution of script file
        if self._is_script_file(first_part):
            info['is_shell_script'] = True
            info['script_path'] = first_part
            info['script_name'] = Path(first_part).name
            return info
        
        # Case 2: Interpreter followed by script
        if first_part.lower() in ['bash', 'sh', '/bin/bash', '/bin/sh', '/usr/bin/bash', '/usr/bin/sh']:
            if len(parts) > 1:
                script_path = parts[1]
                # Skip flags like -c, -x, etc.
                for i, part in enumerate(parts[1:], 1):
                    if not part.startswith('-'):
                        script_path = part
                        break
                
                if self._is_script_file(script_path):
                    info['is_shell_script'] = True
                    info['script_path'] = script_path
                    info['script_name'] = Path(script_path).name
                    return info
        
        # Case 3: Full path to shell interpreter
        if '/sh' in first_part or '/bash' in first_part:
            if len(parts) > 1:
                script_path = parts[1]
                if self._is_script_file(script_path):
                    info['is_shell_script'] = True
                    info['script_path'] = script_path
                    info['script_name'] = Path(script_path).name
                    return info
        
        # Case 4: Commands that are typically shell scripts (checking for .sh extension in any part)
        for part in parts:
            if self._is_script_file(part):
                info['is_shell_script'] = True
                info['script_path'] = part
                info['script_name'] = Path(part).name
                return info
        
        return info
    
    def _is_script_file(self, file_path: str) -> bool:
        """Check if a file path appears to be a shell script"""
        if not file_path:
            return False
        
        # Check for shell script extensions
        script_extensions = {'.sh', '.bash', '.zsh', '.ksh', '.csh'}
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext in script_extensions:
            return True
        
        # Check for common script naming patterns
        file_name = Path(file_path).name.lower()
        script_patterns = ['script', 'backup', 'maintenance', 'cleanup', 'monitor', 'deploy']
        
        # If it has no extension but contains script-like words and is executable path
        if not file_ext and any(pattern in file_name for pattern in script_patterns):
            return True
        
        # If it's in typical script directories
        script_dirs = ['/usr/local/bin/', '/opt/', '/home/', '/root/', './']
        if any(file_path.startswith(dir_path) for dir_path in script_dirs) and not file_ext:
            # Could be a script without extension
            return True
        
        return False
    
    def _get_top_commands(self, limit: int = 5) -> List[Dict]:
        """Get the most frequently used commands"""
        sorted_commands = sorted(self.cron_command_frequency.items(), 
                               key=lambda x: x[1], reverse=True)
        return [{'command': cmd, 'frequency': freq} for cmd, freq in sorted_commands[:limit]]
    
    def _get_top_schedules(self, limit: int = 5) -> List[Dict]:
        """Get the most frequently used schedules"""
        sorted_schedules = sorted(self.schedule_frequency.items(), 
                                key=lambda x: x[1], reverse=True)
        return [{'schedule': sched, 'frequency': freq, 'description': self._describe_cron_timing(*sched.split())} 
                for sched, freq in sorted_schedules[:limit]]
    
    def _get_top_scheduled_scripts(self, limit: int = 5) -> List[Dict]:
        """Get the most frequently scheduled shell scripts"""
        sorted_scripts = sorted(self.shell_script_frequency.items(), 
                              key=lambda x: x[1], reverse=True)
        
        result = []
        for script_path, freq in sorted_scripts[:limit]:
            schedules = self.shell_script_schedules[script_path]
            unique_schedules = list(set(schedules))
            
            result.append({
                'script_path': script_path,
                'script_name': Path(script_path).name,
                'frequency': freq,
                'unique_schedules': len(unique_schedules),
                'schedules': unique_schedules
            })
        
        return result
    
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
                'unique_cron_commands': len(self.unique_cron_commands),
                'unique_schedules': len(self.unique_schedules),
                'unique_job_combinations': len(self.unique_job_combinations),
                'cron_files_found': len(self.cron_jobs),
                'most_frequent_commands': self._get_top_commands(5),
                'most_frequent_schedules': self._get_top_schedules(5),
                'cron_details': self.cron_jobs,
                'command_frequency': dict(self.cron_command_frequency),
                'schedule_frequency': dict(self.schedule_frequency),
                'shell_script_analysis': {
                    'unique_scheduled_shell_scripts': len(self.scheduled_shell_scripts),
                    'total_shell_script_jobs': len(self.shell_script_cron_jobs),
                    'scheduled_scripts': list(self.scheduled_shell_scripts),
                    'most_frequent_scripts': self._get_top_scheduled_scripts(5),
                    'shell_script_jobs': self.shell_script_cron_jobs,
                    'script_frequency': dict(self.shell_script_frequency)
                }
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
        print(f"Unique Commands: {cron['unique_cron_commands']}")
        print(f"Unique Schedules: {cron['unique_schedules']}")
        print(f"Unique Job Combinations: {cron['unique_job_combinations']}")
        print(f"Cron Files Found: {cron['cron_files_found']}")
        
        # Show most frequent commands
        if cron['most_frequent_commands']:
            print("\nMost Frequent Commands:")
            for cmd_info in cron['most_frequent_commands']:
                print(f"  • {cmd_info['command']} (used {cmd_info['frequency']} times)")
        
        # Show most frequent schedules
        if cron['most_frequent_schedules']:
            print("\nMost Frequent Schedules:")
            for sched_info in cron['most_frequent_schedules']:
                print(f"  • {sched_info['schedule']} (used {sched_info['frequency']} times)")
                print(f"    {sched_info['description']}")
        
        # Show shell script scheduling analysis
        shell_analysis = cron.get('shell_script_analysis', {})
        if shell_analysis.get('unique_scheduled_shell_scripts', 0) > 0:
            print(f"\n🐚 SCHEDULED SHELL SCRIPTS ANALYSIS")
            print("-" * 40)
            print(f"Unique Shell Scripts Scheduled: {shell_analysis['unique_scheduled_shell_scripts']}")
            print(f"Total Shell Script Jobs: {shell_analysis['total_shell_script_jobs']}")
            
            if shell_analysis.get('most_frequent_scripts'):
                print("\nMost Frequently Scheduled Scripts:")
                for script_info in shell_analysis['most_frequent_scripts']:
                    print(f"  • {script_info['script_name']} (scheduled {script_info['frequency']} times)")
                    print(f"    Path: {script_info['script_path']}")
                    print(f"    Unique schedules: {script_info['unique_schedules']}")
                    for schedule in script_info['schedules']:
                        print(f"      - {schedule}")
        
        if cron['cron_details']:
            print("\nCron Jobs Details:")
            for cron_file in cron['cron_details']:
                print(f"\n  File: {cron_file['relative_path']}")
                for job in cron_file['jobs']:
                    shell_indicator = " 🐚" if job.get('is_shell_script', False) else ""
                    print(f"    • Schedule: {job['schedule']}{shell_indicator}")
                    print(f"      Timing: {job['timing_description']}")
                    print(f"      Command: {job['command'][:60]}{'...' if len(job['command']) > 60 else ''}")
                    if job.get('is_shell_script', False):
                        print(f"      Shell Script: {job.get('shell_script_name', 'N/A')}")
                    print(f"      Normalized: {job['normalized_command']}")
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
        
        # Export unique cron analysis
        self._export_unique_cron_analysis_csv(report, output_path, timestamp)
        
        # Export scheduled shell scripts
        self._export_scheduled_shell_scripts_csv(report, output_path, timestamp)
        
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
            fieldnames = ['cron_file', 'relative_path', 'line_number', 'schedule', 'minute', 'hour', 'day', 'month', 'dayofweek', 'command', 'normalized_command', 'timing_description', 'command_frequency', 'schedule_frequency', 'is_shell_script', 'shell_script_path', 'shell_script_name']
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
                    
                    # Get frequency information
                    cmd_freq = cron_analysis['command_frequency'].get(job['normalized_command'], 1)
                    sched_freq = cron_analysis['schedule_frequency'].get(job['schedule'], 1)
                    
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
                        'normalized_command': job['normalized_command'],
                        'timing_description': job['timing_description'],
                        'command_frequency': cmd_freq,
                        'schedule_frequency': sched_freq,
                        'is_shell_script': job.get('is_shell_script', False),
                        'shell_script_path': job.get('shell_script_path', ''),
                        'shell_script_name': job.get('shell_script_name', '')
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
            
            writer.writerow({
                'metric': 'Unique Cron Commands',
                'count': cron_analysis['unique_cron_commands'],
                'details': f"Distinct commands scheduled across all cron jobs"
            })
            
            writer.writerow({
                'metric': 'Unique Cron Schedules',
                'count': cron_analysis['unique_schedules'],
                'details': f"Distinct scheduling patterns used"
            })
            
            writer.writerow({
                'metric': 'Unique Job Combinations',
                'count': cron_analysis['unique_job_combinations'],
                'details': f"Unique schedule+command combinations"
            })
            
            # Shell script scheduling metrics
            shell_script_analysis = cron_analysis.get('shell_script_analysis', {})
            if shell_script_analysis:
                writer.writerow({
                    'metric': 'Unique Scheduled Shell Scripts',
                    'count': shell_script_analysis.get('unique_scheduled_shell_scripts', 0),
                    'details': f"Distinct shell scripts scheduled in cron jobs"
                })
                
                writer.writerow({
                    'metric': 'Total Shell Script Cron Jobs',
                    'count': shell_script_analysis.get('total_shell_script_jobs', 0),
                    'details': f"Total number of cron jobs executing shell scripts"
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
    
    def _export_unique_cron_analysis_csv(self, report: Dict, output_path: Path, timestamp: str):
        """Export unique cron job analysis to CSV"""
        cron_analysis = report['cron_analysis']
        
        # Export unique commands
        filename = f"unique_cron_commands_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['command', 'frequency', 'schedules_used']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            # Get all schedules for each command
            command_schedules = defaultdict(set)
            for cron_file in cron_analysis['cron_details']:
                for job in cron_file['jobs']:
                    command_schedules[job['normalized_command']].add(job['schedule'])
            
            for cmd_info in cron_analysis['most_frequent_commands']:
                schedules = list(command_schedules[cmd_info['command']])
                writer.writerow({
                    'command': cmd_info['command'],
                    'frequency': cmd_info['frequency'],
                    'schedules_used': '; '.join(schedules)
                })
        
        print(f"Unique commands analysis exported to: {filename}")
        
        # Export unique schedules
        filename = f"unique_cron_schedules_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['schedule', 'frequency', 'description', 'commands_using']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            # Get all commands for each schedule
            schedule_commands = defaultdict(set)
            for cron_file in cron_analysis['cron_details']:
                for job in cron_file['jobs']:
                    schedule_commands[job['schedule']].add(job['normalized_command'])
            
            for sched_info in cron_analysis['most_frequent_schedules']:
                commands = list(schedule_commands[sched_info['schedule']])
                writer.writerow({
                    'schedule': sched_info['schedule'],
                    'frequency': sched_info['frequency'],
                    'description': sched_info['description'],
                    'commands_using': '; '.join(commands)
                })
        
        print(f"Unique schedules analysis exported to: {filename}")
    
    def _export_scheduled_shell_scripts_csv(self, report: Dict, output_path: Path, timestamp: str):
        """Export scheduled shell scripts analysis to CSV"""
        cron_analysis = report['cron_analysis']
        shell_script_analysis = cron_analysis.get('shell_script_analysis', {})
        
        if not shell_script_analysis.get('shell_script_jobs'):
            print("No scheduled shell scripts found to export.")
            return
        
        # Export detailed shell script jobs
        filename = f"scheduled_shell_scripts_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['script_name', 'script_path', 'schedule', 'timing_description', 'cron_file', 'line_number', 'full_command', 'frequency']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            script_frequency = shell_script_analysis.get('script_frequency', {})
            
            for job in shell_script_analysis['shell_script_jobs']:
                writer.writerow({
                    'script_name': job['script_name'],
                    'script_path': job['script_path'],
                    'schedule': job['schedule'],
                    'timing_description': job['timing_description'],
                    'cron_file': Path(job['cron_file']).name,
                    'line_number': job['line'],
                    'full_command': job['full_command'],
                    'frequency': script_frequency.get(job['script_path'], 1)
                })
        
        print(f"Scheduled shell scripts exported to: {filename}")
        
        # Export shell script summary
        filename = f"shell_script_summary_{timestamp}.csv"
        filepath = output_path / filename
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['script_name', 'script_path', 'total_schedules', 'unique_schedules', 'schedules_list']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for script_info in shell_script_analysis.get('most_frequent_scripts', []):
                writer.writerow({
                    'script_name': script_info['script_name'],
                    'script_path': script_info['script_path'],
                    'total_schedules': script_info['frequency'],
                    'unique_schedules': script_info['unique_schedules'],
                    'schedules_list': '; '.join(script_info['schedules'])
                })
        
        print(f"Shell script summary exported to: {filename}")


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
