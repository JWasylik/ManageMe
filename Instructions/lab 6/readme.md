### Logowanie
- Zaimplementuj logowanie za pomocą Google
- Konto logujące się za pomocą OAuth zyskuje domyślną rolę "guest" (nowa rola w systemie).
- Konta z rolą guest są kontami typu "readonly" - mogą przeglądać projekty, historyjki i zadania (wszystkie), nie mogą nic modyfikować.

## Przed implementacją
- Zaloguj się do Google Cloud (console.cloud.google.com)  
- Wybierz projekt (lub utwórz nowy)
- Z dostępnych usług wybierz Cloud Logging API
- Utwórz dane dostępowe dla nowego klienta (sekcja Klienci->Utwórz klienta)
- Dodaj użytkownika testowego (sekcja Odbiorcy->Użytkownicy testowi)