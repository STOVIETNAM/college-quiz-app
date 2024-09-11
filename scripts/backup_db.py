import os
import time
import argparse
import shutil

dump_program = 'mariadb-dump'

if shutil.which(dump_program) is None:
    dump_program = 'mysqldump'
if shutil.which(dump_program) is None:
    print('Make sure that you have mariadb-dump or mysqldump')
    exit(1)

parser = argparse.ArgumentParser(description="Python script use to backup MySQL / MariaDB database with some features like auto delete old backup files,...")

parser.add_argument('--user', type=str, required=True, help='Database user')
parser.add_argument('--password', type=str, required=True, help='Database password')
parser.add_argument('--host', type=str, default='127.0.0.1', help='Database host (127.0.0.1)')
parser.add_argument('--port', type=int, default=3306, help='Database port (3306)')
parser.add_argument('--database', type=str, required=True, help='Database name')
parser.add_argument('--out-dir', type=str, required=True, help='Out dir')
parser.add_argument('--keep-days', type=int, default=7, help='Number of days to keep old backup files')

args = parser.parse_args()

timestamp = int(time.time())

user = args.user
password = args.password
database = args.database
host = args.host
port = args.port
out_dir = args.out_dir

os.makedirs(out_dir, exist_ok = True)

final_path = os.path.join(out_dir, f'{database}-{timestamp}.sql')

command = ' '.join([
    dump_program,
    f'--user={user}',
    f'--password={password}',
    f'--host={host}',
    f'--port={port}',
    f'--databases {database}',
    '--skip-ssl',
    '--quick',
    '--single-transaction',
    '--compress',
    f'--result-file {final_path}',
])

start_time = time.time()

exit_code = os.system(command = command)

if exit_code != 0:
    os.remove(final_path)
else:
    end_time = time.time()
    print(f'Dump time: {end_time - start_time} seconds')

    keep_days = args.keep_days
    seconds_of_day = 86400
    list_of_files = os.listdir(out_dir)
    for file in list_of_files:
        if (file.endswith('.sql') == False): continue
        file_location = os.path.join(out_dir, file)
        file_time = os.stat(file_location).st_mtime
        if (file_time < timestamp - seconds_of_day * keep_days):
            os.remove(file_location)

