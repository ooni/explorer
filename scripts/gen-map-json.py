import csv
import json
import math

def get_coords():
    in_file = open('simplemaps-worldcities-basic.csv')
    csv_reader = csv.reader(in_file)
    next(csv_reader)

    coords = {}
    for row in csv_reader:
        lat = row[2]
        lng = row[3]
        pop = row[4]
        alpha2 = row[6]
        coords[alpha2] = coords.get(alpha2, [])
        coords[alpha2].append({
            'lat': float(lat),
            'lng': float(lng),
            'pop': float(pop)
        })
    in_file.close()
    return coords

def get_report_counts():
    with open('report-count.csv') as in_file:
        csv_reader = csv.reader(in_file)
        next(csv_reader)
        counts = {}
        for row in csv_reader:
            counts[row[1]] = float(row[0])
    return counts


coords = get_coords()
counts = get_report_counts()
max_count = max(counts.values())

coordinate_list = []
for cc, c in counts.items():
    if cc not in coords:
        print('missing country %s' % cc)
        continue
    pop_counts = [v['pop'] for v in coords[cc]]
    max_population = max(pop_counts)

    for v in coords[cc]:
        try:
            magnitude = 0.1*math.log(c)/math.log(max_count) + 0.3*v['pop']/max_population
        except:
            magnitude = 0
        coordinate_list.append(v['lat'])
        coordinate_list.append(v['lng'])
        coordinate_list.append(magnitude)

with open('map-magnitude.json', 'w+') as out_file:
    json.dump({'coordinates': coordinate_list}, out_file)
