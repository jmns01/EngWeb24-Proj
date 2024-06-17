import csv
import json
import re
import queue

def read_csv(filename : str) -> list:
    """
    Reads csv file and organizes everything in a list of dictionaries
    """
    data = []
    with open(filename, 'r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            for key, value in row.items():
                if '\n' in value:
                    row[key] = value.replace('\n', ' ')
            data.append(row)
    return data

def switch_id(json_dic : dict) -> dict:
    """
    Ranames the 'ID' key to '_id' to be compatible with mongoDB
    """
    new = []
    for elem in json_dic:
        row = elem
        row = {'_id': row.pop('ID'), **row}
        new.append(row) 
    return new

def fix_types(json_dic : dict) -> dict:
    """
    Removes quotes from values that should be different types
    """
    new = []
    for row in json_dic:
        elem = row
        elem['_id'] = int(elem['_id'])
        elem['UnitId'] = int(elem['UnitId'])
        elem['UnitDateInitialCertainty'] = bool(elem['UnitDateInitialCertainty'])
        elem['UnitDateFinalCertainty'] = bool(elem['UnitDateFinalCertainty'])
        elem['AllowUnitDatesInference'] = bool(elem['AllowUnitDatesInference'])
        elem['AllowExtentsInference'] = bool(elem['AllowExtentsInference'])
        elem['AllowTextualContentInference'] = bool(elem['AllowTextualContentInference'])
        elem['ApplySelectionTable'] = bool(elem['ApplySelectionTable'])
        elem['Revised'] = bool(elem['Revised'])
        elem['Published'] = bool(elem['Published'])
        elem['Available'] = bool(elem['Available'])
        elem['Highlighted'] = bool(elem['Highlighted'])

        new.append(elem)
    return new

def get_higher_relations(json_dic : dict, id : int, name_to_id : dict) -> dict:
    """
    Analyses the 'ScopeContent' field which contains information regarding genealogical relationships of the person
    """
    names_pattern = re.compile(r'Filiação:((?:\s*\w{2,})+)(?:\s*e\s*((?:\s*\w{2,})+))?.')
    new_relations = []

    for doc in json_dic:
        if doc["_id"] == id:
            match = names_pattern.search(doc["ScopeContent"])
            if not match:
                print("Inquirição sem relações")
            else:
                for i in range(1, 3):
                    if match.group(i):
                        name = match.group(i).strip()
                        relation_id = name_to_id.get(name, 0)
                        if relation_id != 0:
                            new_relations.append({"key" : name, "value" : relation_id})
    return new_relations    

def check_relations(relatiosArray : list, id : int) -> bool:
    """
    Checks if a certain id is already in the relations array
    """
    for rel in relatiosArray:
        if rel["value"] == id:
            return True
    return False

def make_relations(json_dic : dict) -> dict:
    """
    Analyses the 'ScopeContent' field which contains information regarding genealogical relationships of the person
    """
    names_pattern = re.compile(r'Filiação:((?:\s*\w{2,})+)(?:\s*e\s*((?:\s*\w{2,})+))?.')
    temp_id = []
    
    name_to_id = {}
    for row in json_dic:
        name = row["UnitTitle"].lstrip("Inquirição de genere de").strip()
        name = name.replace(" e ", ", ")
        name = name.split(", ")
        if len(name) == 1:
            name_to_id[name[0]] = row["_id"]
        else:
            for n in name:
                name_to_id[n] = row["_id"]
    
    for row in json_dic:
        elem = row
        elem["Relations"] = []
        
        match = names_pattern.search(row["ScopeContent"])
        
        if not match:
            print("Inquirição sem relações")
        else:
            for i in range(1, 3):
                if match.group(i):
                    name = match.group(i).strip()
                    relation_id = name_to_id.get(name, 0)
                    if relation_id != 0:
                        elem["Relations"].append({"key" : name, "value" : relation_id})
                        temp_id.append(relation_id)
                    while len(temp_id)>0:
                        if len(new_relations := get_higher_relations(json_dic, temp_id.pop(0), name_to_id))>0:
                            print("RECEBI RELAÇÕES" + str(new_relations))
                            elem["Relations"] += (new_relations)
                            for rel in new_relations:
                                if rel and not check_relations(elem["Relations"], rel["value"]):
                                    temp_id.append(rel["value"])
                        #temp_id.pop(0)
        temp_id.clear()
                    
    return json_dic


def write_to_json(json_dic : dict, json_filename : str) -> None:
    """
    Writes dictonary to file
    """
    with open(json_filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(json_dic, jsonfile, ensure_ascii=False, indent=4)


csv_data = read_csv('PT-UM-ADB-DIO-MAB-006.CSV')
id_fixed = switch_id(csv_data)
types = fix_types(id_fixed)
relations = make_relations(types)
write_to_json(relations, 'inquiricoes.json')
