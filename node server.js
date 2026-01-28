function handleLogin() {
    const u = document.getElementById('log_user').value;
    const p = document.getElementById('log_pass').value;
    
    // Mettre à jour ici aussi pour le test local
    if(u === 'admin' && p === 'wilson eliotta mwenda 2003') { 
        currentUser = { role: 'ADMIN', name: 'Super Admin' }; 
        applyLogin(); 
        return; 
    }
    // ... reste du code
}
