let bigCookie = document.getElementById('bigCookie');

do {
    bigCookie.click();
    setTimeout(() => {
          bigCookie.click();
        }, 100);
} while (true)