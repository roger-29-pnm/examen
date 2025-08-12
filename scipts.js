
        // Variables globales
        let messages = [
            {
                id: 1,
                content: "Bonjour tout le monde ! Comment allez-vous aujourd'hui ?",
                author: "Alice",
                timestamp: new Date(2024, 11, 10, 9, 30)
            },
            {
                id: 2,
                content: "Je travaille sur un nouveau projet JavaScript, c'est passionnant !",
                author: "Bob",
                timestamp: new Date(2024, 11, 10, 10, 15)
            },
            {
                id: 3,
                content: "Quelqu'un a-t-il des recommandations pour un bon restaurant ?",
                author: "Alice",
                timestamp: new Date(2024, 11, 10, 11, 0)
            },
            {
                id: 4,
                content: "La météo est magnifique aujourd'hui, parfait pour une promenade !",
                author: "Charlie",
                timestamp: new Date(2024, 11, 10, 14, 20)
            }
        ];

        let currentUser = "Alice";
        let currentFilter = "";
        let editingMessageId = null;

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            renderMessages();
            updateAuthorFilters();
            updateStats();
        });

        // Histoire utilisateur 2 : Créer un message
        function toggleNewMessageForm() {
            const form = document.getElementById('newMessageForm');
            form.classList.toggle('active');
            if (form.classList.contains('active')) {
                document.getElementById('newMessageContent').focus();
            }
        }

        function createMessage() {
            const content = document.getElementById('newMessageContent').value.trim();
            
            if (!content) {
                alert('Veuillez saisir un message !');
                return;
            }

            const newMessage = {
                id: Date.now(),
                content: content,
                author: currentUser,
                timestamp: new Date()
            };

            messages.push(newMessage);
            
            // Réinitialiser le formulaire
            document.getElementById('newMessageContent').value = '';
            document.getElementById('newMessageForm').classList.remove('active');
            
            renderMessages();
            updateAuthorFilters();
            updateStats();
        }

        function cancelNewMessage() {
            document.getElementById('newMessageContent').value = '';
            document.getElementById('newMessageForm').classList.remove('active');
        }

        // Histoire utilisateur 1 : Afficher les messages
        function renderMessages() {
            const container = document.getElementById('messagesContainer');
            const filteredMessages = currentFilter ? 
                messages.filter(msg => msg.author === currentFilter) : 
                messages;

            if (filteredMessages.length === 0) {
                container.innerHTML = `
                    <div class="no-messages">
                        <div class="no-messages-icon">📭</div>
                        <p>${currentFilter ? `Aucun message de ${currentFilter}` : 'Aucun message disponible'}</p>
                    </div>
                `;
                return;
            }

            // Trier par date (plus récents en premier)
            const sortedMessages = filteredMessages.sort((a, b) => b.timestamp - a.timestamp);
            
            container.innerHTML = sortedMessages.map(message => `
                <div class="message-card">
                    <div class="message-header">
                        <div class="message-info">
                            <div class="author" onclick="filterMessages('${message.author}')">
                                👤 ${message.author}
                            </div>
                            <div class="timestamp">
                                🕒 ${formatTimestamp(message.timestamp)}
                            </div>
                        </div>
                        ${message.author === currentUser ? `
                            <div class="message-actions">
                                <button class="btn btn-primary btn-small" onclick="startEditMessage(${message.id})">
                                    ✏️ Modifier
                                </button>
                                <button class="btn btn-danger btn-small" onclick="deleteMessage(${message.id})">
                                    🗑️ Supprimer
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="message-content" onclick="toggleMessageDetails(${message.id})">
                        ${message.content}
                    </div>
                    
                    <div class="message-details" id="details-${message.id}">
                        <h4>📋 Détails du message</h4>
                        <p><strong>Auteur:</strong> ${message.author}</p>
                        <p><strong>Date:</strong> ${formatTimestamp(message.timestamp)}</p>
                        <p><strong>ID:</strong> ${message.id}</p>
                        <p><strong>Caractères:</strong> ${message.content.length}</p>
                    </div>
                    
                    <div class="edit-form" id="edit-${message.id}">
                        <div class="form-group">
                            <label>Modifier le message :</label>
                            <textarea 
                                id="editContent-${message.id}" 
                                class="form-control" 
                                rows="3"
                            >${message.content}</textarea>
                        </div>
                        <div class="edit-actions">
                            <button class="btn btn-success btn-small" onclick="saveEditMessage(${message.id})">
                                💾 Sauvegarder
                            </button>
                            <button class="btn btn-secondary btn-small" onclick="cancelEditMessage(${message.id})">
                                ❌ Annuler
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Afficher/masquer les détails d'un message
        function toggleMessageDetails(messageId) {
            const details = document.getElementById(`details-${messageId}`);
            details.classList.toggle('active');
        }

        // Histoire utilisateur 3 : Modifier un message
        function startEditMessage(messageId) {
            if (editingMessageId && editingMessageId !== messageId) {
                cancelEditMessage(editingMessageId);
            }
            
            editingMessageId = messageId;
            const editForm = document.getElementById(`edit-${messageId}`);
            editForm.classList.add('active');
            document.getElementById(`editContent-${messageId}`).focus();
        }

        function saveEditMessage(messageId) {
            const newContent = document.getElementById(`editContent-${messageId}`).value.trim();
            
            if (!newContent) {
                alert('Le message ne peut pas être vide !');
                return;
            }

            // Trouver et modifier le message
            const messageIndex = messages.findIndex(msg => msg.id === messageId);
            if (messageIndex !== -1) {
                messages[messageIndex].content = newContent;
                messages[messageIndex].timestamp = new Date(); // Mettre à jour l'horodatage
            }

            cancelEditMessage(messageId);
            renderMessages();
            updateStats();
        }

        function cancelEditMessage(messageId) {
            const editForm = document.getElementById(`edit-${messageId}`);
            if (editForm) {
                editForm.classList.remove('active');
            }
            editingMessageId = null;
        }

        // Histoire utilisateur 4 : Supprimer un message
        function deleteMessage(messageId) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
                messages = messages.filter(msg => msg.id !== messageId);
                renderMessages();
                updateAuthorFilters();
                updateStats();
            }
        }

        // Histoire utilisateur 5 : Filtrer par auteur
        function filterMessages(author) {
            currentFilter = author;
            renderMessages();
            updateFilterButtons();
            updateStats();
        }

        function updateAuthorFilters() {
            const uniqueAuthors = [...new Set(messages.map(msg => msg.author))];
            const container = document.getElementById('authorFilters');
            
            container.innerHTML = uniqueAuthors.map(author => `
                <button class="filter-btn" onclick="filterMessages('${author}')">
                    ${author}
                </button>
            `).join('');
            
            updateFilterButtons();
        }

        function updateFilterButtons() {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            if (currentFilter) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    if (btn.textContent.trim() === currentFilter) {
                        btn.classList.add('active');
                    }
                });
            } else {
                document.querySelector('.filter-btn').classList.add('active');
            }
        }

        // Utilitaires
        function formatTimestamp(date) {
            return date.toLocaleDateString('fr-FR') + ' à ' + 
                   date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }

        function updateStats() {
            const filteredMessages = currentFilter ? 
                messages.filter(msg => msg.author === currentFilter) : 
                messages;
            const uniqueAuthors = [...new Set(messages.map(msg => msg.author))];
            
            document.getElementById('totalMessages').textContent = messages.length;
            document.getElementById('displayedMessages').textContent = filteredMessages.length;
            document.getElementById('totalAuthors').textContent = uniqueAuthors.length;
        }

        // Gestion du clavier
        document.addEventListener('keydown', function(e) {
            // Échapper pour annuler les actions
            if (e.key === 'Escape') {
                if (editingMessageId) {
                    cancelEditMessage(editingMessageId);
                }
                if (document.getElementById('newMessageForm').classList.contains('active')) {
                    cancelNewMessage();
                }
            }
            
            // Ctrl+Enter pour publier
            if (e.ctrlKey && e.key === 'Enter') {
                if (document.getElementById('newMessageForm').classList.contains('active')) {
                    createMessage();
                }
            }
        });
