# study-hive-back

## Variables d'environnement utilisées

Voici la liste des variables utilisées dans ce projet, qui sont toutes stockées dans les *secrets* de GitHub pour des raisons de sécurité.

### Variables pour la construction et l'exécution du serveur

1. **DB_USERNAME**  
   - Description : Nom d'utilisateur pour se connecter à la base de données.  
   - Source : Stockée dans les *secrets* de GitHub.

2. **DB_PASSWORD**  
   - Description : Mot de passe pour se connecter à la base de données.  
   - Source : Stockée dans les *secrets* de GitHub.

3. **DB_HOST**  
   - Description : Hôte (URL ou IP) de la base de données.  
   - Source : Stockée dans les *secrets* de GitHub.

4. **DB_PORT**  
   - Description : Port utilisé pour la connexion à la base de données.  
   - Source : Stockée dans les *secrets* de GitHub.

5. **DB_DATABASE**  
   - Description : Nom de la base de données.  
   - Source : Stockée dans les *secrets* de GitHub.

6. **DB_SCHEMA**  
   - Description : Schéma de la base de données.  
   - Source : Stockée dans les *secrets* de GitHub.

### Variables pour l'intégration avec CleverCloud

7. **CLEVER_SSH_PRIVATE_KEY**  
   - Description : Clé privée SSH pour se connecter à l'instance CleverCloud.  
   - Source : Stockée dans les *secrets* de GitHub.

8. **CLEVER_TOKEN**  
   - Description : Token pour s'authentifier auprès de l'API de CleverCloud.  
   - Source : Stockée dans les *secrets* de GitHub.

9. **CLEVER_SECRET**  
   - Description : Secret associé au token pour l'authentification CleverCloud.  
   - Source : Stockée dans les *secrets* de GitHub.

10. **APP_ID**  
    - Description : ID de l'application sur CleverCloud pour l'environnement de production.  
    - Source : Stockée dans les *secrets* de GitHub.

11. **BACK_PORT**  
    - Description : Port d'écoute pour l'application backend sur CleverCloud.  
    - Source : Stockée dans les *secrets* de GitHub.

### Explication des étapes de workflow

1. **Test** : 
   - Cette étape vérifie la connexion à l'application locale en utilisant `curl` pour tester un *health check* de l'application une fois le serveur démarré.
   
2. **Build and Push** : 
   - Une fois le test réussi, le code est poussé vers CleverCloud avec les informations de connexion SSH et les clés privées.
   - Les variables d'environnement associées à la base de données et aux paramètres du backend sont également définies via l'interface CleverCloud (`clever env set`).
   - Enfin, l'application est redémarrée sur CleverCloud pour appliquer les changements.

## Prérequis

Pour que ce processus fonctionne correctement, vous devez avoir configuré les secrets suivants dans votre repository GitHub :

- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_SCHEMA`
- `CLEVER_SSH_PRIVATE_KEY`
- `CLEVER_TOKEN`
- `CLEVER_SECRET`
- `APP_ID`
- `BACK_PORT`

Ces secrets sont utilisés pour sécuriser la connexion à votre base de données et à CleverCloud pendant le processus de déploiement.

## Conclusion

Ce workflow permet de simplifier l'intégration continue et le déploiement continu pour une application Node.js sur CleverCloud en automatisant les étapes essentielles avec GitHub Actions. Assurez-vous de bien définir et protéger vos variables d'environnement pour garantir un déploiement sécurisé.
