import os
import csv

with open("inundation_grid.json", "w") as target:
    writeData = []
    with open("inundation_grid.csv", "r") as source:
        csv_reader = csv.reader(source, delimiter=',')
        for row in csv_reader:
            if row[0] == "X":
                print(row)
            else:
                newData = {
                    "z": float(row[2]),
                    "coordinates": [round(float(row[0]),5), round(float(row[1]),5)]
                }
                writeData.append(newData)
    target.write(str(writeData))

