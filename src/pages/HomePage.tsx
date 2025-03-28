const HomePage = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Witaj w aplikacji ManageMe! 👋</h1>
            <p className="home-description">
                To nowoczesna aplikacja do zarządzania projektami stworzona z myślą o zespołach programistycznych.
                Możesz tu tworzyć projekty, przypisywać historyjki i zarządzać zadaniami.
            </p>

            <ul className="home-features">
                <li>✅ Tworzenie i edycja projektów</li>
                <li>✅ Zarządzanie historyjkami i ich statusem</li>
                <li>✅ Tablica Kanban do śledzenia postępów</li>
                <li>✅ Przypisywanie użytkowników do zadań</li>
            </ul>

            <p className="home-footer">Zacznij od zalogowania się 😀</p>
        </div>
    );
};

export default HomePage;
