const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
                Witaj w aplikacji <span className="text-blue-600 dark:text-blue-400">ManageMe</span>! 👋
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl">
                Zarządzaj swoimi projektami, historyjkami i zadaniami w przejrzysty sposób.
            </p>
        </div>
    );
};

export default HomePage;
