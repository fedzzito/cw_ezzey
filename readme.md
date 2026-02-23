# vizzey
Visualisierung von Energiedaten

# vizzey – Dashboard zur Visualisierung und Auswertung von Energiesensordaten

**vizzey** ist eine Open-Source-Webanwendung zur einfachen und übersichtlichen Visualisierung von Energiedaten aus Energiesensoren und zukünftig anderen Quellen. Die Anwendung läuft im Browser, benötigt keine Installation und setzt auf direkte API-Abfrage sowie CSV-Import/Export. Sie ist für Einsteiger und Fortgeschrittene konzipiert und kann von der Community weiterentwickelt werden.

Zu Beginn können Cloud-Daten von Geräten von powerfox abgerufen und visualisiert werden.

Die Anwendung wurde durch Vibe-Coding erstellt und nicht von einem professionellen Entwickler. 

---

## Features

- **Login:** Einfache Authentifizierung mit powerfox-Zugangsdaten
- **Geräteauswahl:** Anzeige und Auswahl aller verfügbaren powerfox-Geräte
- **Live-Daten:** Visualisierung der aktuellen Leistungswerte
- **Historische Daten:** Analyse und Darstellung von Tages-, Wochen-, Monatswerten
- **CSV-Upload & Download:** Eigenen von Cloud bereitgstellten Datenbestand importieren oder herunterladen
- **Interaktive Diagramme:** Zoomen
- **Spendenfunktion:** PayPal-Button zur freiwilligen Unterstützung des Projekts
- **Open Source:** Mitmachen, anpassen, verbessern – alle sind willkommen!

---

## Getting Started

### 1. Online nutzen

Die Anwendung ist direkt über Netlify erreichbar, z.B. unter  
[https://vizzey.netlify.app](https://vizzey.netlify.app)  
(ggf. aktuellen Link prüfen!)

### 2. Lokal ausführen

1. Repository klonen:
    ```bash
    git clone https://github.com/fedzzito/vizzey.git
    ```
2. Öffne die Datei `index.html` im Browser.

### 3. Eigene Daten anzeigen

- **Mit powerfox-Login:** Einfach E-Mail und Passwort eingeben und die eigenen Energiedaten live anzeigen lassen.
- **Mit CSV-Datei:** CSV-Datei hochladen (Format siehe unten) und historische Leistungswerte visualisieren.

---

## Dateiformate (CSV)

Erwartet werden powerfox-Exportdateien mit mindestens folgenden Spalten:
- `Zeitpunkt (UTC nach ISO 8601)` oder ähnlich
- `Watt`

Beispiel:
```
Zeitpunkt (UTC nach ISO 8601);Watt
2024-04-01T10:00:00Z;35
2024-04-01T10:01:00Z;38
...
```

---

## Mitmachen & Weiterentwickeln

Das Projekt ist offen für Beiträge!  
**Du willst helfen?**  
- Fehler melden (Issues)
- Vorschläge machen
- Code verbessern (Pull Requests)
- Neue Visualisierungen oder Features einbauen

### Anleitung für Mitwirkende

1. Forke das Repository
2. Erstelle eine neue Branch für deine Änderungen
3. Reiche einen Pull Request ein

**Fragen oder Feedback:**  
Schreibe an [fedzzito@gmail.com](mailto:fedzzito@gmail.com)

---

## Monetarisierung & Spenden

Das Projekt ist kostenlos nutzbar.  
Wenn dir die Anwendung gefällt und du die Weiterentwicklung unterstützen willst, kannst du freiwillig per PayPal spenden.  
Der Spenden-Button ist direkt in der Anwendung integriert.

---

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für weitere Informationen.

---

## Screenshots

*(Hier können später Beispielbilder der Visualisierungen eingefügt werden)*

---

## FAQ

**Kann ich andere Energiedatenquellen nutzen?**  
Aktuell ist die Anwendung auf powerfox API und CSV-Import ausgelegt. Weitere Quellen können durch die Community integriert werden.

**Brauche ich Programmierkenntnisse?**  
Für die Nutzung nicht. Für die Weiterentwicklung sind Grundkenntnisse in HTML, JavaScript und D3.js hilfreich.

**Wie bleibt meine Privatsphäre geschützt?**  
Login-Daten werden nur lokal im Browser gespeichert und nicht weitergegeben.

---

## Links

- [GitHub Repo](https://github.com/fedzzito/vizzey)
- [Powerfox API Doku](https://www.powerfox.energy/developer/)
- [D3.js](https://d3js.org/)
- [Netlify](https://www.netlify.com/)

---

Viel Spaß beim Ausprobieren und Weiterentwickeln!  
