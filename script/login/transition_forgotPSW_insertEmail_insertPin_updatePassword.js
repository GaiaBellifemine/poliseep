$(document).ready(function() {
    var navbar = $('.navbar'); /**NAVBAR VEDERE */
    var navbarTextInner = $(navbar).find('.navcontainer');
    var headerSection = $('section.header');
    var animation = $(headerSection).find('.animation');
    var forms = $(headerSection).find('.form-container');

    var headerTimeLine = new TimelineMax({paused: true});
    var animateSpeed = 0.75;
    var easeIn = Circ.easeIn;
    var easeOut = Circ.easeOut;
    /*VEDERE*/

    headerTimeLine.fromTo(headerSection, animateSpeed, /* ANIMAZIONE HEADER (TUTTO)*/
        {
            y: '1500', 
            opacity: 0,
            ease: easeIn
        },
        {
            y: '0', 
            opacity: 1,
            ease: easeOut,
            onComplete: function() {}
        }
    ).fromTo(navbarTextInner, animateSpeed, /* ANIMAZIONE NAVBAR*/
        {
            y: '100%',
            opacity: 0,
            ease: easeIn
        },
        {
            y: '0%',
            opacity: 1,
            ease: easeOut
        }
    ).fromTo(forms, animateSpeed, /*ANIMAZIONE FORM*/
        {
            x: '-100%',
            opacity: 0,
            ease: easeIn
        },
        {
            x: '0%',
            opacity: 1,
            ease: easeOut
        }
    );

    headerTimeLine.play();
});