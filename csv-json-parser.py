import csv
import re

"""
def fix_newline_issue(file_path):
    fixed_records = []
    with open(file_path, 'r', encoding='utf-8') as file:
        record = ""
        for line in file:
            line = line.strip()
            if line.endswith(';'):  # Line ends with a semicolon, meaning it's the end of a record
                record += line
                fixed_records.append(record)
                record = ""
            else:
                record += line + ' '  # Concatenate lines with a space in between
    return fixed_records

# Example usage:
file_path = './PT-UM-ADB-DIO-MAB-006.csv'
fixed_records = fix_newline_issue(file_path)
with open("fixed.csv", "w", encoding="utf-8") as f:
    for line in fixed_records:
        f.write(line + "\n")
"""

def arranjar_espacos(file : object) -> None:
    """
    Some camps have string with newline in them which can cause problems when parsing
    """
    record = ""
    fixed = [] 
    fixed.append(file.readline())
    lines = file.readlines()
    semicolon_match = re.compile('(?:[^;"\']|"[^"]*"+|\'[^\']*\')+')
    for line in lines:
        #splited = line.split(";")
        line.replace("\n", "")
        splited = re.findall(semicolon_match, line)
        if len(splited) > 87: 
            print("Encontrei uma linha com mais colunas do que o suposto!\n")
            print(splited)
            print(len(splited))
        if len(record) == 0:
            if len(splited) == 87:
                record += line
                fixed.append(record)
                record = ""
                print("CONSEGUI")
            else: 
                record += line
        else:
            temp = record + line
            if len(re.findall(semicolon_match, temp)) == 88:
                record += line
                fixed.append(record)
                record = ""
                print("CONSEGUI")

            else: record += line
        
    new = open("./fixed1.csv", "w", encoding="utf-8")
    for fline in fixed:
        new.write(fline)

def add_spaces(file : object) -> None:
    """
    Add a white space between consecutive semicolons
    """
    semicolon = re.compile(';(?=;)')
    first = file.readline()
    lines = file.readlines()
    fixed = []
    fixed.append(first)
    for line in lines:
        mod = re.sub(semicolon, '; ', line)
        if(mod[-2][0] == ';'): mod += " "
        fixed.append(mod)
    new = open("./fixed.csv", "w", encoding="utf-8")
    for line in fixed:
        new.write(line)



def read_data(file_path):
    records = []
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, delimiter=';', quotechar='"')
        for row in reader:
            records.append(row)
    return records
"""
r = read_data("./PT-UM-ADB-DIO-MAB-006.csv")
f = open("./res.csv", "w", encoding="utf-8")
for line in r:
    a = ";".join(line)
    f.write(a + "\n")
"""
f = open("./PT-UM-ADB-DIO-MAB-006.csv", "r", encoding="utf-8")
add_spaces(f)
h = open("./fixed.csv", "r", encoding="utf-8")
arranjar_espacos(h)