#!/bin/bash

echo "Arrêt des serveurs PHP en cours..."
pkill -f "symfony server"
echo "Redémarrage du serveur Symfony avec la configuration personnalisée..."
cd "$(dirname "$0")"
symfony server:start -d --no-tls --port=8000

echo "Serveur démarré ! Accédez à l'API via http://127.0.0.1:8000"
