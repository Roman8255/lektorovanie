heslo = input("Zadaj heslo: ")
posun = int(input("Zadaj posun: "))

male = False
velke = False
cislo = False
special = False

for znak in heslo:
    if znak.islower():
        male = True
    elif znak.isupper():
        velke = True
    elif znak.isdigit():
        cislo = True
    else:
        special = True

body = 0

if len(heslo) >= 8:
    body += 1
if male:
    body += 1
if velke:
    body += 1
if cislo:
    body += 1
if special:
    body += 1

if body <= 2:
    sila = "slabé"
elif body <= 4:
    sila = "stredné"
else:
    sila = "silné"

zasifrovane = ""

for znak in heslo:
    if znak.isupper():
        novy = chr((ord(znak) - 65 + posun) % 26 + 65)
        zasifrovane += novy
    elif znak.islower():
        novy = chr((ord(znak) - 97 + posun) % 26 + 97)
        zasifrovane += novy
    else:
        zasifrovane += znak

desifrovane = ""

for znak in zasifrovane:
    if znak.isupper():
        novy = chr((ord(znak) - 65 - posun) % 26 + 65)
        desifrovane += novy
    elif znak.islower():
        novy = chr((ord(znak) - 97 - posun) % 26 + 97)
        desifrovane += novy
    else:
        desifrovane += znak

print("Pôvodné heslo:", heslo)
print("Sila hesla:", sila)
print("Zašifrované heslo:", zasifrovane)
print("Dešifrované heslo:", desifrovane)