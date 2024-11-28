let vh = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    document.documentElement.style.setProperty('--vh', `${vh}px`);
})

// Функция для установки cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Установка времени жизни cookie
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Сохранение cookie
}

function getCookie(name) {
    const nameEQ = name + "="; // Формируем строку для поиска
    const ca = document.cookie.split(';'); // Разделяем все cookies на массив
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]; // Берем каждое cookie
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Убираем пробелы в начале
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // Если нашли, возвращаем значение
    }
    return null; // Если не нашли, возвращаем null
}
function deleteCookie(name) {
    // Устанавливаем дату истечения в прошлое
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC;"; 
    document.cookie = name + "=;" + expires + "path=/"; // Удаляем cookie
}


function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Если не в полноэкранном режиме, войти в него
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    } else {
        // Если уже в полноэкранном режиме, выйти из него
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}


$(document).ready(function() {
    function awardFunc() {
        $('.award__next-family').click(function() {
            $('.awardCube').removeClass('open')
            $('.awardEnd').addClass('open');
            setCookie('saveGame', 'compleateGameEnd', 7);
        })
        $('.award__next-reload').click(function() {
            deleteCookie('saveGame');
            location.reload();
        })
        $('.award__next-close').click(function() {
            $('.awardEnd').removeClass('open');
        })

        

        
    }
    awardFunc()

    function audioGame() {
        $('.audioGame').click(function() {
            $(this).toggleClass('muted');
            $('.audioGame__button-active').toggleClass('none');
            $('.audioGame__button-mute').toggleClass('none');
            if(!$(this).hasClass('muted')) {
                $(this).find('audio').prop('volume', 1)
            } else {
                $(this).find('audio').prop('volume', 0)
            }
        })
    }
    audioGame()

    function closeModal() {
        $('.popup__close').click(function() {
            $('html').removeClass('hidden');
            $('.popup').removeClass('open');
        });
        $(document).mouseup(function (e) {
            var container = $(".popup-wrapper");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $('html').removeClass('hidden');
                $(".popup").removeClass("open");
            }
        });
        $('.popup-reset__button[data-reset="no"]').click(function() {
            $('html').removeClass('hidden');
            $('.popup').removeClass('open');
        }) 
        $('.popup-reset__button[data-reset="yes"]').click(function() {
            deleteCookie('saveGame');
            location.reload();
        }) 
    }
    closeModal();

    function openPopup() { 
        $('.resetGame').click(function (e) {
            e.preventDefault();
            $('html').addClass('hidden');
            $('.popup-reset').addClass('open');
        });
    }
    openPopup();

    function loadGame() {
        $.ajax({
            url: "assets/json/loadGame.json",
            dataType: "json",
            success: function(data) {
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                async function displayMessages(data) {
                    for(let i = 1; i <= Object.keys(data).length; i++) {
                        $('.loadGame-dialog__message').text(data['dialog' + i].message)
                        await delay(2000); // Ожидание 1 секунда
                    }
                    displayMessages(data);
                }
                displayMessages(data);
                setTimeout(() => {
                    $('.loadGame-wrapper').removeClass('opacity');
                    $('.loadGame .backgroundGame').addClass('scaleGame');
                    switch (getCookie('saveGame')) {
                        case 'homePage':
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').remove();
                                $('.homePage').removeClass('none');
                                setTimeout(() => {
                                    $('.homePage .backgroundGame').removeClass('scaleGame');
                                    setTimeout(() => {
                                        $('.homePage-wrapper').addClass('opacity');
                                        setTimeout(() => {
                                            $('.homePage-rooms-item').eq(0).find('.key').addClass('anim');
                                            setTimeout(() => {
                                                $('.homePage-rooms-item').eq(0).addClass('open');
                                                homePageSettings();
                                            }, 1000);
                                        }, 1000);
                                    }, 1500);
                                }, 500);
                            }, 1500);
                          break;
                        case 'compleateOneGame':
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').remove();
                                $('.homePage').removeClass('none');
                                setTimeout(() => {
                                    $('.homePage .backgroundGame').removeClass('scaleGame');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').find('.key').addClass('anim');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').addClass('open completed')
                                    setTimeout(() => {
                                        $('.homePage-wrapper').addClass('opacity');
                                        setTimeout(() => {
                                            $('.homePage-rooms-item[data-game="gameSearch"]').find('.key').addClass('anim');
                                            setTimeout(() => {
                                                $('.homePage-rooms-item[data-game="gameSearch"]').addClass('open')
                                                homePageSettings();
                                            }, 1000);
                                        }, 1000);
                                    }, 1500);
                                }, 500);
                            }, 1500);
                          break;
                        case 'compleateTwoGame':
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').remove();
                                $('.homePage').removeClass('none');
                                setTimeout(() => {
                                    $('.homePage .backgroundGame').removeClass('scaleGame');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').find('.key').addClass('anim');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').addClass('open completed')
    
                                    $('.homePage-rooms-item[data-game="gameSearch"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameSearch"]').find('.key').addClass('anim');
                                    setTimeout(() => {
                                        $('.homePage-wrapper').addClass('opacity');
                                        setTimeout(() => {
                                            $('.homePage-rooms-item[data-game="gameTrue"]').find('.key').addClass('anim');
                                            setTimeout(() => {
                                                $('.homePage-rooms-item[data-game="gameTrue"]').addClass('open')
                                                homePageSettings();
                                            }, 1000);
                                        }, 1000);
                                    }, 1500);
                                }, 500);
                            }, 1500);
                            homePageSettings();
                          break;
                        case 'compleateThreeGame':
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').remove();
                                $('.homePage').removeClass('none');
                                setTimeout(() => {
                                    $('.homePage .backgroundGame').removeClass('scaleGame');
    
                                    $('.homePage-rooms-item[data-game="gameGarage"]').find('.key').addClass('anim');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').addClass('open completed')
            
                                    $('.homePage-rooms-item[data-game="gameSearch"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameSearch"]').find('.key').addClass('anim');
            
                                    $('.homePage-rooms-item[data-game="gameTrue"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameTrue"]').find('.key').addClass('anim');
                                    setTimeout(() => {
                                        $('.homePage-wrapper').addClass('opacity');
                                        setTimeout(() => {
                                            $('.homePage-rooms-item[data-game="gameRebus"]').find('.key').addClass('anim');
                                            setTimeout(() => {
                                                $('.homePage-rooms-item[data-game="gameRebus"]').addClass('open')
                                                homePageSettings();
                                            }, 1000);
                                        }, 1000);
                                    }, 1500);
                                }, 500);
                            }, 1500);
                            homePageSettings();
                          break;
                        case 'compleateFourGame':
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').remove();
                                $('.homePage').removeClass('none');
                                setTimeout(() => {
                                    $('.homePage .backgroundGame').removeClass('scaleGame');
    
                                    $('.homePage-rooms-item[data-game="gameGarage"]').find('.key').addClass('anim');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').addClass('open completed')
            
                                    $('.homePage-rooms-item[data-game="gameSearch"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameSearch"]').find('.key').addClass('anim');
            
                                    $('.homePage-rooms-item[data-game="gameTrue"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameTrue"]').find('.key').addClass('anim');

                                    $('.homePage-rooms-item[data-game="gameRebus"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameRebus"]').find('.key').addClass('anim');
                                    setTimeout(() => {
                                        $('.homePage-wrapper').addClass('opacity');
                                        setTimeout(() => {
                                            $('.homePage-rooms-item[data-game="gameTest"]').find('.key').addClass('anim');
                                            setTimeout(() => {
                                                $('.homePage-rooms-item[data-game="gameTest"]').addClass('open')
                                                homePageSettings();
                                            }, 1000);
                                        }, 1000);
                                    }, 1500);
                                }, 500);
                            }, 1500);
                            homePageSettings();
                          break;
                        case 'compleateGameCube':
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').remove();
                                $('.homePage').removeClass('none');
                                setTimeout(() => {
                                    $('.homePage .backgroundGame').removeClass('scaleGame');
    
                                    $('.homePage-rooms-item[data-game="gameGarage"]').find('.key').addClass('anim');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').addClass('open completed')
            
                                    $('.homePage-rooms-item[data-game="gameSearch"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameSearch"]').find('.key').addClass('anim');
            
                                    $('.homePage-rooms-item[data-game="gameTrue"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameTrue"]').find('.key').addClass('anim');

                                    $('.homePage-rooms-item[data-game="gameRebus"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameRebus"]').find('.key').addClass('anim');

                                    $('.homePage-rooms-item[data-game="gameTest"]').addClass('open')
                                    $('.homePage-rooms-item[data-game="gameTest"]').find('.key').addClass('anim');
                                    setTimeout(() => {
                                        $('.homePage-wrapper').addClass('opacity');
                                        setTimeout(() => {
                                            $('.award-block-info p span').text(getCookie('namePlayer'))
                                            $('.awardCube').addClass('open');
                                        }, 1000);
                                    }, 1500);
                                }, 500);
                            }, 1500);
                            homePageSettings();
                          break;
                        case 'compleateGameEnd':
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').remove();
                                $('.homePage').removeClass('none');
                                setTimeout(() => {
                                    $('.homePage .backgroundGame').removeClass('scaleGame');
    
                                    $('.homePage-rooms-item[data-game="gameGarage"]').find('.key').addClass('anim');
                                    $('.homePage-rooms-item[data-game="gameGarage"]').addClass('open completed')
            
                                    $('.homePage-rooms-item[data-game="gameSearch"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameSearch"]').find('.key').addClass('anim');
            
                                    $('.homePage-rooms-item[data-game="gameTrue"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameTrue"]').find('.key').addClass('anim');

                                    $('.homePage-rooms-item[data-game="gameRebus"]').addClass('open completed')
                                    $('.homePage-rooms-item[data-game="gameRebus"]').find('.key').addClass('anim');

                                    $('.homePage-rooms-item[data-game="gameTest"]').addClass('open')
                                    $('.homePage-rooms-item[data-game="gameTest"]').find('.key').addClass('anim');
                                    setTimeout(() => {
                                        $('.homePage-wrapper').addClass('opacity');
                                        setTimeout(() => {
                                            $('.awardEnd').addClass('open');
                                        }, 1000);
                                    }, 1500);
                                }, 500);
                            }, 1500);
                            homePageSettings();
                          break;
                        default:
                            setTimeout(() => {
                                $('.loadGame').addClass('none');
                                $('.beginGame').removeClass('none');
                                setTimeout(() => {
                                    $('.beginGame .backgroundGame').removeClass('scaleGame');
                                    setTimeout(() => {
                                        $('.beginGame-wrapper').addClass('opacity');
                                    }, 1500);
                                }, 500);
                            }, 1500);
                    }
                }, 20000);
            }
        })
    }
    loadGame();

    $.ajax({
        url: "assets/json/begin.json",
        dataType: "json",
        success: function(data) {
            function beginGame() {
                let nextQuestion = 2; // Цифра для кнопки далее
                $('.beginGame-dialog__message-text').text(data['dialog1'].message)
                $('.beginGame-dialog__input').on('keypress', function(event) {
                    if (event.which === 13) {
                        $('.beginGame-dialog-info__next').removeClass('none')
                        $('.beginGame-dialog__message-text').text(data['dialog2'].message)
                        setCookie('namePlayer', $('.beginGame-dialog__input').val(), 7);
                        $('.beginGame-dialog__input').remove()
                        $('.beginGame-dialog__save-name').remove()
                    }
                });
                $('.beginGame-dialog__save-name').on('click', function() {
                    $('.beginGame-dialog-info__next').removeClass('none')
                    $('.beginGame-dialog__message-text').text(data['dialog2'].message)
                    setCookie('namePlayer', $('.beginGame-dialog__input').val(), 7);
                    $('.beginGame-dialog__input').remove()
                    $('.beginGame-dialog__save-name').remove()

                });
                $('.beginGame-dialog-info__next').click(function() {
                    nextQuestion++;
                    if(data['dialog' + nextQuestion] != undefined) {
                        $('.beginGame-dialog__message-text').text(data['dialog' + nextQuestion].message);
                    } else {
                        $('.beginGame-dialog').addClass('close');
                        $('.beginGame .backgroundGame').addClass('scaleGame');
                        setTimeout(() => {
                            $('.beginGame').addClass('none');
                            $('.homePage').removeClass('none');
                            setTimeout(() => {
                                $('.homePage .backgroundGame').removeClass('scaleGame');
                                setTimeout(() => {
                                    $('.homePage-wrapper').addClass('opacity');
                                    setTimeout(() => {
                                        $('.homePage-rooms-item').eq(0).find('.key').addClass('anim');
                                        setTimeout(() => {
                                            $('.homePage-rooms-item').eq(0).addClass('open');
                                            homePageSettings();
                                        }, 1000);
                                    }, 1000);
                                }, 1500);
                            }, 500);
                        }, 1500);
                        setCookie('saveGame', 'homePage', 7);
                    }
                })
            }
            beginGame();
        }
    })

    function homePageSettings() {
        function startMinigame() {
            $('.homePage-rooms-item.open').click(function() {
                let gameSelect = $(this).attr('data-game');
                $('.minigameSection').each(function() {
                    if(gameSelect == $(this).attr('data-game')) {
                        $('.homePage .backgroundGame').addClass('scaleGame');
                        $('.homePage-wrapper').removeClass('opacity');
                        setTimeout(() => {
                            $('.homePage').addClass('none');
                            $(this).removeClass('none');
                            setTimeout(() => {
                                $(this).find('.backgroundGame').removeClass('scaleGame');
                                setTimeout(() => {
                                    $(this).find('.minigameSection-wrapper').addClass('opacity');
                                }, 1500);
                            }, 500);
                        }, 1500);
                    }
                })
            })
        }
        startMinigame()
    }
    function gameOne() {
        $('.gameOne-start__button.start').click(function() {
            $('.gameOne-start').addClass('none')
            $('.gameOne-list').removeClass('none')
        })
        $('.gameOne-start__button.end').click(function() {
            $('.gameOne-wrapper').removeClass('opacity')
            $('.gameOne .backgroundGame').addClass('scaleGame');
            $('.homePage-rooms-item[data-game="gameGarage"]').addClass('completed')
            setTimeout(() => {
                $('.gameOne').addClass('none');
                $('.homePage').removeClass('none');
                // Читстим миниигру
                $('.gameOne-item').removeClass('success');
                $('.gameOne-item').find('.gameOne-item-image-main').removeClass('none');
                $('.gameOne-start.end').addClass('none');
                $('.gameOne-start.start').removeClass('none');
                setTimeout(() => {
                    $('.homePage .backgroundGame').removeClass('scaleGame');
                    setTimeout(() => {
                        $('.homePage-wrapper').addClass('opacity');
                        setTimeout(() => {
                            $('.homePage-rooms-item').eq(4).find('.key').addClass('anim');
                            setTimeout(() => {
                                $('.homePage-rooms-item').eq(4).addClass('open');
                                if(getCookie('saveGame') == 'homePage') {
                                    setCookie('saveGame', 'compleateOneGame', 7);
                                }
                                homePageSettings();
                            }, 1000);
                        }, 1000);
                    }, 1500);
                }, 500);
            }, 1500);
        })
        function checkShowImage() {
            let count = 0;
            $('.gameOne-item').each(function() {
                if($(this).hasClass('show')) {
                    count++;
                    if(count == 2) {
                        let arrayResult = [];
                        $('.gameOne-item.show').each(function() {
                            arrayResult.push($(this).find('.gameOne-item-image-result').attr('src'))
                        })
                        if (arrayResult[0] == arrayResult[1]) {
                            $('.gameOne-item.show').each(function() {
                                setTimeout(() => {
                                    $(this).find('.gameOne-item-image-main').addClass('none');
                                    $(this).addClass('success');
                                    $(this).removeClass('show');
                                    
                                    $('body').append(`<audio class="none audioSuccess" loop autoplay src="assets/audio/success.mp3"></audio>`)
                                    setTimeout(() => {
                                        $('.audioSuccess').remove()
                                    }, 1000);
                                    $('.gameOne-modal').addClass('opacity');
                                    $('.gameOne-modal__text').html($(this).find('.gameOne-item__message').html());
                                    endGame()
                                }, 500);
                            })
                        } else {
                            setTimeout(() => {
                                $('.gameOne-item').removeClass('show');
                                $('body').append(`<audio class="none audioError" loop autoplay src="assets/audio/error.mp3"></audio>`)
                                setTimeout(() => {
                                    $('.audioError').remove()
                                }, 1000);
                            }, 500);
                        }
                    }
                }
            })
        }
        function openImage() {
            $('.gameOne-item').click(function() {
                if(!$(this).hasClass('show')) {
                    $(this).addClass('show');
                    checkShowImage()
                } else {
                    $(this).removeClass('show');
                }
            })
        }
        openImage()

        function endGame() {
            $('.gameOne-modal-inner span').click(function() {
                if($('.gameOne-item.success').length == $('.gameOne-item').length) {
                    $('.gameOne-modal').removeClass('opacity');
                    $('.gameOne-list').addClass('none')
                    $('.gameOne-start.end').removeClass('none');
                } else {
                    $('.gameOne-modal').removeClass('opacity');
                }
            })
        }
    }
    gameOne();

    function gameTwo() {
        $('.gameTwo-start__button.start').click(function() {
            $('.gameTwo-start').addClass('none')
            $('.gameTwo-box').removeClass('none')
            $('.backgroundGame').addClass('none');
        })
        $('.gameTwo-start__button.end').click(function() {
            $('.gameTwo-wrapper').removeClass('opacity')
            $('.gameTwo .backgroundGame').addClass('scaleGame');
            $('.homePage-rooms-item[data-game="gameSearch"]').addClass('completed')
            setTimeout(() => {
                $('.gameTwo').addClass('none');
                $('.homePage').removeClass('none');
                // Читстим миниигру
                $('.gameTwo-objects-item').removeClass('find');
                $('.gameTwo-start.end').addClass('none');
                $('.gameTwo-start.start').removeClass('none');
                setTimeout(() => {
                    $('.homePage .backgroundGame').removeClass('scaleGame');
                    setTimeout(() => {
                        $('.homePage-wrapper').addClass('opacity');
                        setTimeout(() => {
                            $('.homePage-rooms-item').eq(2).find('.key').addClass('anim');
                            setTimeout(() => {
                                $('.homePage-rooms-item').eq(2).addClass('open');
                                if(getCookie('saveGame') == 'compleateOneGame') {
                                    setCookie('saveGame', 'compleateTwoGame', 7);
                                }
                                homePageSettings();
                            }, 1000);
                        }, 1000);
                    }, 1500);
                }, 500);
            }, 1500);
        })
        function findThing() {
            $.ajax({
                url: "assets/json/gameTwo.json",
                dataType: "json",
                success: function(data) {
                    $('.gameTwo-box-message__text').html(data['item1'].message)
                    let count = 1;
                    $('.gameTwo-objects-item').click(function() {
                        if(data['item' + count] != undefined) {
                            if($(this).attr('data-name') == data['item' + count].answer) {
                                $(this).addClass('find')
                                count++;
                                if(data['item' + count] != undefined) {
                                    $('.gameTwo-box-message__text').html(data['item' + count].message)
                                }
                                $('.gameTwo-objects-item').click(function() {
                                    if($('.gameTwo-objects-item.find').length == $('.gameTwo-objects-item').length) {
                                        $('.gameTwo-box').addClass('none')
                                        $('.gameTwo-start.end').removeClass('none');
                                        $('.backgroundGame').removeClass('none');
                                        count = 1;
                                        $('.gameTwo-box-message__text').html(data['item1'].message)
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
        findThing()

    }
    gameTwo();
    
    function gameThree() {
        $('.gameThree-start__button.start').click(function() {
            $('.gameThree-start').addClass('none')
            $('.gameThree-main').removeClass('none')
        })
        $('.gameThree-start__button.end').click(function() {
            $('.gameThree-wrapper').removeClass('opacity')
            $('.gameThree .backgroundGame').addClass('scaleGame');
            $('.homePage-rooms-item[data-game="gameTrue"]').addClass('completed')
            setTimeout(() => {
                $('.gameThree').addClass('none');
                $('.homePage').removeClass('none');
                // Читстим миниигру
                $('.gameThree-start.end').addClass('none');
                $('.gameThree-start.start').removeClass('none');
                setTimeout(() => {
                    $('.homePage .backgroundGame').removeClass('scaleGame');
                    setTimeout(() => {
                        $('.homePage-wrapper').addClass('opacity');
                        setTimeout(() => {
                            $('.homePage-rooms-item').eq(1).find('.key').addClass('anim');
                            setTimeout(() => {
                                $('.homePage-rooms-item').eq(1).addClass('open');
                                if(getCookie('saveGame') == 'compleateTwoGame') {
                                    setCookie('saveGame', 'compleateThreeGame', 7);
                                }
                                homePageSettings();
                            }, 1000);
                        }, 1000);
                    }, 1500);
                }, 500);
            }, 1500);
        })
        function gamaPlay() {
            $.ajax({
                url: "assets/json/gameThree.json",
                dataType: "json",
                success: function(data) {
                    $('.gameThree-main .gameThree-start-rule__text').text(data['item1'].message)
                    let count = 1;
                    $('.gameThree-main-item__button').click(function() {
                        if(data['item' + count] != undefined) {

                            if($(this).attr('data-answer') == data['item' + count].answer) {
                                $(this).addClass('success');
                                $('body').append(`<audio class="none audioSuccess" loop autoplay src="assets/audio/success.mp3"></audio>`)
                                setTimeout(() => {
                                    $('.audioSuccess').remove()
                                }, 1000);
                                setTimeout(() => {
                                    $(this).removeClass('success');
                                    count++;
                                    if(data['item' + count] != undefined) {
                                        $('.gameThree-main .gameThree-start-rule__text').text(data['item' + count].message)
                                    }
                                    if(count == 9) {
                                        setTimeout(() => {
                                            $('.gameThree-main').addClass('none')
                                            $('.gameThree-start.end').removeClass('none');
                                            count = 1;
                                            $('.gameThree-main .gameThree-start-rule__text').text(data['item' + count].message)
                                        }, 1000);
                                    }
                                }, 1500);
                            } else {
                                $(this).addClass('errorButton')
                                $('body').append(`<audio class="none audioError" loop autoplay src="assets/audio/error.mp3"></audio>`)
                                setTimeout(() => {
                                    $('.audioError').remove()
                                }, 1000);
                                setTimeout(() => {
                                    $(this).removeClass('errorButton')
                                }, 200);
                            }
                        }
                    })
                }
            })
        }
        gamaPlay()
    }
    gameThree();

    

    function gameFour() {
        $('.gameFour-start__button.start').click(function() {
            $('.gameFour-start').addClass('none')
            $('.gameFour-main').removeClass('none')
        })
        $('.gameFour-start__button.end').click(function() {
            $('.gameFour-wrapper').removeClass('opacity')
            $('.gameFour .backgroundGame').addClass('scaleGame');
            $('.homePage-rooms-item[data-game="gameRebus"]').addClass('completed')
            setTimeout(() => {
                $('.gameFour').addClass('none');
                $('.homePage').removeClass('none');
                // Читстим миниигру
                $('.gameFour-start.end').addClass('none');
                $('.gameFour-start.start').removeClass('none');
                setTimeout(() => {
                    $('.homePage .backgroundGame').removeClass('scaleGame');
                    setTimeout(() => {
                        $('.homePage-wrapper').addClass('opacity');
                        setTimeout(() => {
                            $('.homePage-rooms-item').eq(3).find('.key').addClass('anim');
                            setTimeout(() => {
                                $('.homePage-rooms-item').eq(3).addClass('open');
                                if(getCookie('saveGame') == 'compleateThreeGame') {
                                    setCookie('saveGame', 'compleateFourGame', 7);
                                }
                                homePageSettings();
                            }, 1000);
                        }, 1000);
                    }, 1500);
                }, 500);
            }, 1500);
        })
        function gamaPlay() {
            $.ajax({
                url: "assets/json/gameFour.json",
                dataType: "json",
                success: function(data) {
                    let count = 1;
                    let countPreload = 2;
                    $('.gameFour-main__image img.load').attr('src', data['item' + count].image)
                    $('.gameFour-main__image img.preload').attr('src', data['item' + countPreload].image)

                    $('.gameFour-main-panel__input').on('keypress', function(event) {
                        let valueInput = $(this).val().trim()
                        if (event.which === 13) {
                            if(data['item' + count] != undefined) {
                                if(valueInput.toUpperCase() == data['item' + count].answer.toUpperCase()) {
                                    $('.gameFour-main-bottom').find('.gameFour-main-item').each(function() {
                                        if($(this).attr('data-answer') == data['item' + count].class) {
                                            setTimeout(() => {
                                                $(this).find('p').addClass('opacity');
                                                count++;
                                                countPreload++;
                                                if(data['item' + count] != undefined) {
                                                    $('.gameFour-main__image img.load').addClass('op')
                                                    setTimeout(() => {
                                                        $('.gameFour-main__image img.load').removeClass('op')
                                                        $('.gameFour-main__image img.load').attr('src', data['item' + count].image);
                                                        setTimeout(() => {
                                                            $('.gameFour-main__image img.preload').attr('src', data['item' + countPreload].image);
                                                        }, 500);
                                                    }, 500);
                                                } else {
                                                    setTimeout(() => {
                                                        $('.gameFour-main').addClass('none')
                                                        $('.gameFour-start.end').removeClass('none');
                                                        count = 1;
                                                        $('.gameFour-main__image img.load').attr('src', data['item' + count].image);
                                                        $('.gameFour-main__image img.preload').attr('src', data['item' + countPreload].image);
                                                        $('.gameFour-main-item-three p').removeClass('opacity')
                                                    }, 1000);
                                                }
                                                $('.gameFour-main-panel__input').val('')
                                            }, 100);
                                        }
                                    })
                                }
                            }
                        }
                    });
                    $('.gameFour-main-panel__button').click(function() {
                        let valueInput = $('.gameFour-main-panel__input').val().trim()
                        if(data['item' + count] != undefined) {
                            if(valueInput.toUpperCase() == data['item' + count].answer.toUpperCase()) {
                                $('.gameFour-main-bottom').find('.gameFour-main-item').each(function() {
                                    if($(this).attr('data-answer') == data['item' + count].class) {
                                        setTimeout(() => {
                                            $(this).find('p').addClass('opacity');
                                            count++;
                                            countPreload++;
                                            if(data['item' + count] != undefined) {
                                                //$('.gameFour-main__image img.load').attr('src', data['item' + count].image);
                                                //$('.gameFour-main__image img.preload').attr('src', data['item' + countPreload].image);
                                               /* console.log(count)
                                                if(count == 8) {
                                                    /*setTimeout(() => {
                                                        $('.gameFour-main').addClass('none')
                                                        $('.gameFour-start.end').removeClass('none');
                                                        count = 1;
                                                        countPreload = 2;
                                                        $('.gameFour-main__image img.load').attr('src', data['item' + count].image);
                                                        $('.gameFour-main__image img.preload').attr('src', data['item' + countPreload].image);
                                                    }, 1000);*/
                                                    
                                               /* }*/
                                                $('.gameFour-main__image img.load').addClass('op')
                                                setTimeout(() => {
                                                    $('.gameFour-main__image img.load').removeClass('op')
                                                    $('.gameFour-main__image img.load').attr('src', data['item' + count].image);
                                                    setTimeout(() => {
                                                        $('.gameFour-main__image img.preload').attr('src', data['item' + countPreload].image);
                                                    }, 500);
                                                }, 500);
                                            } else {
                                                setTimeout(() => {
                                                    $('.gameFour-main').addClass('none')
                                                    $('.gameFour-start.end').removeClass('none');
                                                    count = 1;
                                                    countPreload = 2;
                                                    $('.gameFour-main__image img.load').attr('src', data['item' + count].image);
                                                    $('.gameFour-main__image img.preload').attr('src', data['item' + countPreload].image);
                                                    $('.gameFour-main-item-three p').removeClass('opacity')
                                                }, 1000);
                                            }
                                            $('.gameFour-main-panel__input').val('')
                                            
                                        }, 100);
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
        gamaPlay()
    }
    gameFour();

    function gameFive() {
        $('.gameFive-start__button.start').click(function() {
            $('.gameFive-start').addClass('none')
            $('.gameFive-main').removeClass('none')
        })
        $('.gameFive-start__button.end').click(function() {
            $('.gameFive-wrapper').removeClass('opacity')
            $('.gameFive .backgroundGame').addClass('scaleGame');
            $('.homePage-rooms-item[data-game="gameTest"]').addClass('completed')
            setTimeout(() => {
                $('.gameFive').addClass('none');
                $('.homePage').removeClass('none');
                // Читстим миниигру
                $('.gameFive-start.end').addClass('none');
                $('.gameFive-start.start').removeClass('none');
                setTimeout(() => {
                    $('.homePage .backgroundGame').removeClass('scaleGame');
                    setTimeout(() => {
                        $('.homePage-wrapper').addClass('opacity');
                        setTimeout(() => {
                            if(getCookie('saveGame') == 'compleateFourGame') {
                                setCookie('saveGame', 'compleateGameCube', 7);
                                $('.award-block-info p span').text(getCookie('namePlayer'))
                                $('.awardCube').addClass('open');
                            }
                            homePageSettings();
                        }, 1000);
                    }, 1500);
                }, 500);
            }, 1500);
        })
        function gamaPlay() {
            $.ajax({
                url: "assets/json/gameFive.json",
                dataType: "json",
                success: function(data) {
                    $('.gameFive-main-item__answer').text(data['item1'].question)
                    for(let i = 1; i <= Object.keys(data['item1'].answer).length; i++) {
                        $('.gameFive-main-item-btns').append(`
                            <button class="gameFive-main-item-btns__button" data-answer="${i}">
                                ${data['item1'].answer[i]}
                            </button>
                        `)
                    }
                    let count = 1;

                   
                    
                    $('.gameFive-main-item-btns').on('click', '.gameFive-main-item-btns__button', function() {
                        let trueAnswer = data['item' + count].success;
                        if(data['item' + count].success == $(this).attr('data-answer')) {
                            $(this).addClass('success');
                            count++; 
                            $('body').append(`<audio class="none audioSuccess" loop autoplay src="assets/audio/success.mp3"></audio>`)
                            setTimeout(() => {
                                $('.audioSuccess').remove()
                            }, 1000);
                        } else {
                            $(this).addClass('error');
                            $(this).parent().find('.gameFive-main-item-btns__button[data-answer="' + trueAnswer + '"]').addClass('success')
                            count++;
                            $('body').append(`<audio class="none audioError" loop autoplay src="assets/audio/error.mp3"></audio>`)
                            setTimeout(() => {
                                $('.audioError').remove()
                            }, 1000);
                        }
                        setTimeout(() => {
                            $('.gameFive-main-item-btns').html(``);
                            if (data['item' + count]) {
                                $('.gameFive-main-item__answer').text(data['item' + count].question)
                                for(let i = 1; i <= Object.keys(data['item' + count].answer).length; i++) {
                                    $('.gameFive-main-item-btns').append(`
                                        <button class="gameFive-main-item-btns__button" data-answer="${i}">
                                            ${data['item' + count].answer[i]}
                                        </button>
                                    `)
                                }
                            } else {
                                $('.gameFive-main').addClass('none')
                                $('.gameFive-start.end').removeClass('none');
                                count = 1;
                                $('.gameFive-main-item__answer').text(data['item1'].question)
                                for(let i = 1; i <= Object.keys(data['item1'].answer).length; i++) {
                                    $('.gameFive-main-item-btns').append(`
                                        <button class="gameFive-main-item-btns__button" data-answer="${i}">
                                            ${data['item1'].answer[i]}
                                        </button>
                                    `)
                                }
                            }
                        }, 2000);
                    })
                }
            })
        }
        gamaPlay()
    }
    gameFive();

    
})
