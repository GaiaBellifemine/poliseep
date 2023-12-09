// dichiarazione di elementi html
const imgDiv = document.querySelector('.profile-pic-div');
const img = document.querySelector('#photo');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');

// sezione che gestisce se l'utente passa con il mouse su img div (hover)

imgDiv.addEventListener('mouseenter', function(){
    uploadBtn.style.display = "block";
});

// sezione che gestisce quando l'utente esce con il mouse da img div (hover)

imgDiv.addEventListener('mouseleave', function(){
    uploadBtn.style.display = "none";
});

//sezione relativa al caricamento della foto

file.addEventListener('change', function(){
    // qui si fa riferimento al file
    const choosedFile = this.files[0];

    if (choosedFile) {

        const reader = new FileReader();

        reader.addEventListener('load', function(){
            img.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(choosedFile);
    }
});