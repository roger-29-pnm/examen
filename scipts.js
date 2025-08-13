// Configuration de l'API
const API_URL = "https://votre-api-de-messagerie.com/messages"; // Remplacez par l'URL réelle de votre API
const CURRENT_USER = "Alice"; // Vous pourriez aussi récupérer ça depuis l'API

// Fonction principale pour charger les messages
async function loadMessages() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erreur de chargement des messages");
        const messages = await response.json();
        renderMessages(messages);
        updateAuthorFilters(messages);
        updateStats(messages);
    } catch (error) {
        console.error("Erreur:", error);
        document.getElementById('messagesContainer').innerHTML = `
            <div class="error-message">
                ❌ Impossible de charger les messages. Veuillez réessayer plus tard.
            </div>
        `;
    }
}

// Fonction pour créer un nouveau message
async function createMessage() {
    const content = document.getElementById('newMessageContent').value.trim();
    
    if (!content) {
        alert('Veuillez saisir un message !');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                author: CURRENT_USER
            })
        });

        if (!response.ok) throw new Error("Erreur lors de la création du message");
        
        document.getElementById('newMessageContent').value = '';
        document.getElementById('newMessageForm').classList.remove('active');
        
        // Recharger les messages après création
        loadMessages();
    } catch (error) {
        console.error("Erreur:", error);
        alert("Échec de l'envoi du message");
    }
}

// Fonction pour supprimer un message
async function deleteMessage(messageId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
        const response = await fetch(`${API_URL}/${messageId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error("Erreur lors de la suppression");
        
        loadMessages();
    } catch (error) {
        console.error("Erreur:", error);
        alert("Échec de la suppression du message");
    }
}

// Fonction pour modifier un message
async function saveEditMessage(messageId) {
    const newContent = document.getElementById(`editContent-${messageId}`).value.trim();
    
    if (!newContent) {
        alert('Le message ne peut pas être vide !');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${messageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newContent
            })
        });

        if (!response.ok) throw new Error("Erreur lors de la modification");
        
        cancelEditMessage(messageId);
        loadMessages();
    } catch (error) {
        console.error("Erreur:", error);
        alert("Échec de la modification du message");
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', loadMessages);

// Les autres fonctions (renderMessages, updateStats, etc.) restent similaires mais doivent être adaptées
// pour utiliser les données de l'API plutôt que le tableau local 'messages'