minimo_solo = 85;
minimo_duo = 110;
minimo_suma_compra = 110;
minimo_suma_venta = 110;
rand = 1733;
ultima_jugada = $('#price-pointer-value').html();
call_btn = $('#btnCall');
put_btn = $('#btnPut');
close_all_noti = $('#close_all');
cont = 0;
max_cont = 0;
balance = 0.0;
min_money = "0.00000005";
verificado = false;
minimo_fuerza = 1;
cantidad_old = 0;
balance_old = parseFloat($('#header_btns > div > div > ul > li > div.multiselect-balance').html().replace("BTC&nbsp;", ""));

function martingale() {
	$('#amount-field').val(parseFloat($('#amount-field').val()) * 2);
}

function reset() {
	$('#amount-field').val(parseFloat(min_money));
}

function Ganar() {
	atual = parseFloat($('#header_btns > div > div > ul > li > div.multiselect-balance').html().replace("BTC&nbsp;", ""));
	if ($('#btnCall').hasClass('btn-disabled') == false && cont <= max_cont) {
		if (atual < balance_old) {
			martingale();
		} else {
			reset();
		}
		verificado = true;
		url = "https://super-trading.tk/technicals/BTCUSD/";
		$.ajax({
			url: url,
			success: function (data) {
				accion = data[0];
				cantidad = data[1];
				precio = data.split(", ")[1];
				volumen_top = parseFloat($('#volumes-top').html().replace("%", ""));
				orders_top = parseFloat($('#orders-top').html().replace("%", ""));
				volumen_bottom = parseFloat($('#volumes-bottom').html().replace("%", ""));
				orders_bottom = parseFloat($('#orders-bottom').html().replace("%", ""));
				$('.notif_item-close').click();
				price_actual = $('#price-pointer-value').html().replace(" ", "").split('.')[0];
				if (parseFloat(cantidad) >= parseFloat(minimo_fuerza)) {
					if (accion == "c") {
						if (cantidad_old <= cantidad) {
							// prediction
							if (price_actual < precio) {
								// solo
								if (parseFloat(volumen_top) > minimo_solo || parseFloat(orders_top) > minimo_solo) {
									$('#btnCall').click();
									cont = cont + 1;
								}
								// duo
								if (parseFloat(parseFloat(volumen_top) + parseFloat(orders_top)) > minimo_duo) {
									$('#btnCall').click();
									cont = cont + 1;
								}
							}
						}
					}
					if (accion == "v") {
						if (cantidad_old >= cantidad) { // prediction
							if (price_actual > precio) {
								// solo
								if (parseFloat(volumen_bottom) > minimo_solo || parseFloat(orders_bottom) > minimo_solo) {
									$('#btnPut').click();
									cont = cont + 1;
								}
								// duo
								if (parseFloat(parseFloat(volumen_bottom) + parseFloat(orders_bottom)) > minimo_duo) {
									$('#btnPut').click();
									cont = cont + 1;
								}
							}
						}
					}
				}
				if (accion == "n") {}
				cantidad_old = data[1];
				ultima_jugada = parseFloat(price_actual);
				balance_old = parseFloat($('#header_btns > div > div > ul > li > div.multiselect-balance').html().replace("BTC&nbsp;", ""));
			}
		});
	}
	if ($('#btnCall').hasClass('btn-disabled') == true) {
		cont = 0;
		verificado = false;
	}
}
(function loop() {
	reset();
	setTimeout(function () {
		Ganar();
		loop();
	}, 1000);
}());
