import csv

def tipos_desc(file):
    descs=[]
    file.readline() # skip da primeira
    info = file.readlines()
    for line in info:
        partes = line.split(';')
        print(partes)
        if partes[1] not in descs:
            descs.append(partes[1])
    return descs

def n_colunas(file):
    first = file.readline()
    return len(first.split(";"))

f = open("./PT-UM-ADB-DIO-MAB-006.csv", "r", encoding="utf-8")
#tipos_desc(f)
print("Número de propriedades: " + str(n_colunas(f)))