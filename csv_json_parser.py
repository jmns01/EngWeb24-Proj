import csv
import json

def read_csv(filename):
    data = []
    with open(filename, 'r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            for key, value in row.items():
                if '\n' in value:
                    row[key] = value.replace('\n', ' ')
            data.append(row)
    return data

def switch_id(json_dic):
    new = []
    for elem in json_dic:
        row = elem
        row = {'_id': row.pop('ID'), **row}
        new.append(row) 
    return new

def convert_to_json(csv_data, json_filename):
    with open(json_filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(csv_data, jsonfile, ensure_ascii=False, indent=4)


csv_data = read_csv('PT-UM-ADB-DIO-MAB-006.csv')
id_fixed = switch_id(csv_data)
convert_to_json(id_fixed, 'inquiricoes.json')
