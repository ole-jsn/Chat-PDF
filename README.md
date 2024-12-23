# Chat PDF Projekt

##### Eine Next.js App mit der OpenAI API, die es ermöglicht mit GPT-4o-mini über eine PDF Datei zu chatten.
Der API-Key ist hierbei eine Variable, die vom User selber angegeben wird.

## Dokumentation der Entwicklung

#### - Herausforderungen
- Da ich zuvor noch nie mit Next.js gearbeitet habe, musste ich mich zunächst mit dem Framework zurecht finden und bei den Basics starten.
- Die erste wirklich kniflige Herausforderung war der interne API Post Request der PDF Datei und des API Keys. Hierbei wurde die Request nicht richtig im Ziel verarbeitet. Ein Fehler von mir war, dass ich zunächst nur auf die Hilfe von ChatGPT gesetzt habe. Als ich dann manuell das Ziel der Post Request gecodet habe, hat der Empfang geklappt und ich konnte den nächsten Schritt der Verarbeitung angehen.
- Die größte Herausforderung des Projektes war das Weiterleiten des extrahierten PDF Textes und des API Keys, um den API Call an OpenAI auszuüben. Ich habe zunächst verschiedenste Varianten ausprobiert, da ich nicht wusste, was die beste Lösung sei. Aufgrund des Ladens der Seite, zwischen Empfang und Weiterleitung der Variablen, ist die Variable bei meiner ersten Variante immer undefiniert gewesen. Schließlich habe ich das Problem lösen können, indem ich die beiden Variablen in einem .env-File gespeichert habe, welches nach jedem Verlassen der Seite gelöscht wird. Natürlich nichts skalierbares, aber für meine Projektambitionen zufriedenstellend.
- Ansonsten tauchten natürlich immer mal kleinere Probleme auf, diese konnte ich jedoch meist recht zügig lösen. Die beiden gennanten Herausforderungen haben mich jedoch lange aufgehalten.
