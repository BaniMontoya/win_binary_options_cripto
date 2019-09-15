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
max_cont = 1;
balance = 0.0;
max_cont = 0;
min_money_base = "0.000005";
min_money = "0.0000005";
verificado = false;
minimo_fuerza = 1;
cantidad_old = 0;
balance_old = parseFloat($('#header_btns > div > div > ul > li > div.multiselect-balance').html().replace("BTC&nbsp;", ""));

function martingale() {
	min_money = min_money * 2;
}

function reset() {
	min_money = min_money_base;
}

function calcula_martingale() {
	if (elem_ultima <= parseFloat(0)) {
		martingale();
	} else {
		reset();
	}
}

function Ganar() {
	atual = parseFloat($('#header_btns > div > div > ul > li > div.multiselect-balance').html().replace("BTC&nbsp;", ""));
	if ($('#btnCall').hasClass('btn-disabled') == false && cont <= max_cont) {
		//if (atual < balance_old) {
		$('#amount-field').val(min_money);
		try {
			elem_ultima = $('#scroll-container > table > tbody > tr:nth-child(1) > td:nth-child(10)');
			elem_ultima = parseFloat(elem_ultima.html().replace("BTC&nbsp;", ""));
		} catch (error) {}
		calcula_martingale();
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
				if (parseFloat(parseFloat(cantidad)) >= parseFloat(minimo_fuerza)) {
					if (accion == "c") {
						if (cantidad_old <= parseFloat(cantidad) || parseFloat(cantidad) > 2) {
							// prediction
							if (price_actual < precio || parseFloat(cantidad) > 2) {
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
						if (cantidad_old >= parseFloat(cantidad) || parseFloat(cantidad) > 2) { // prediction
							if (price_actual > precio || parseFloat(cantidad) > 2) {
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
	$('#dealsButtonsRegion > ul > li:nth-child(2) > span').click();
	reset();
	setTimeout(function () {
		Ganar();
		loop();
	}, 3000);
}());
