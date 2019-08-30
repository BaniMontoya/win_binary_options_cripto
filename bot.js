minimo_solo = 84;
minimo_duo = 69;
minimo_suma_compra = 128;
minimo_suma_venta = 133;
rand = 1731;
ultima_jugada = $('#price-pointer-value').html();
call_btn = $('#btnCall');
put_btn = $('#btnPut');
close_all_noti = $('#close_all');
cont = 0;
max_cont = 3;
balance = 0.0;
min_money = "0.00000010";
verificado = false;

function martingale() {
    $('#amount-field').val(parseFloat($('#amount-field').val()) + parseFloat("0.00000005"));
}

function reset() {
    $('#amount-field').val(parseFloat(min_money));
}

function Ganar() {
    if ($('#btnCall').hasClass('btn-disabled') == false && cont <= max_cont) {
        if (verificado == false) {
            if (parseFloat($('.multiselect-balance').html().replace("BTC", "")) > 0) {
                martingale();
            } else {
                reset();
            }
        }
        verificado = true;
        url = "https://super-trading.tk/technicals/BTCUSDT/";
        $.ajax({
            url: url,
            success: function(data) {
                accion = data[0];
                cantidad = data[1];
                volumen_top = parseFloat($('#volumes-top').html());
                orders_top = $('#orders-top').html();
                volumen_bottom = $('#volumes-bottom').html();
                orders_bottom = $('#orders-bottom').html();
                $('.notif_item-close').click();
                price_actual = $('#price-pointer-value').html();
                if (accion == "c") {
                    //SUMA COMPRA
                    if (parseFloat(parseFloat(volumen_top) + parseFloat(orders_top)) > minimo_suma_compra) {
                        $('#btnCall').click();
                        cont = cont + 1;
                    }
                    //DUO COMPRA
                    if (parseFloat(volumen_top) > minimo_duo && parseFloat(orders_top) > minimo_duo) {
                        $('#btnCall').click();
                        cont = cont + 1;
                    }
                    //SOLO COMPRA
                    /*if (parseFloat(volumen_top) > minimo_solo || parseFloat(orders_top) > minimo_solo) {
                        $('#btnCall').click();
                        cont = cont + 1;
                    }*/
                }
                if (accion == "v") {
                    //SUMA VENTA
                    if (parseFloat(parseFloat(volumen_bottom) + parseFloat(orders_bottom)) > minimo_suma_venta) {
                        $('#btnPut').click();
                        cont = cont + 1;
                    }
                    //DUO VENTA
                    if (parseFloat(volumen_bottom) > minimo_duo && parseFloat(orders_bottom) > minimo_duo) {
                        $('#btnPut').click();
                        cont = cont + 1;
                    }
                    //SOLO VENTA
                    /*if (parseFloat(volumen_bottom) > minimo_solo || parseFloat(orders_bottom) > minimo_solo) {
                        $('#btnPut').click();
                        cont = cont + 1;
                    }*/
                }
                if (accion == "n") {}
                try {
                    ultima_jugada = parseFloat(price_actual.html().replace(" ", "").split('.')[0]);
                    balance = parseFloat($('#header_btns > div > div > ul > li > div.multiselect-balance').html().replace("&nbsp;BTC", ""));
                } catch (error) {}
            }
        });
    }
    if ($('#btnCall').hasClass('btn-disabled') == true) {
        cont = 0;
        verificado = false;
    }
}
(function loop() {
    setTimeout(function() {
        Ganar();
        loop();
    }, rand);
}());
