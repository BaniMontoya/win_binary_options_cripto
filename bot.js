minimo_solo = 90;
minimo_duo = 125;
minimo_suma_compra = 125;
minimo_suma_venta = 125;
rand = 1733;
ultima_jugada = $('#price-pointer-value').html();
call_btn = $('#btnCall');
put_btn = $('#btnPut');
close_all_noti = $('#close_all');
cont = 0;
max_cont = 10;
balance = 0.0;
min_money = "0.0000005";
verificado = false;
minimo_fuerza = 2;
cantidad_old = 0;

function martingale() {
	$('#amount-field').val(parseFloat($('#amount-field').val()) + "0.00000005");
}

function reset() {
	$('#amount-field').val(parseFloat(min_money));
}

function Ganar() {
	if ($('#btnCall').hasClass('btn-disabled') == false && cont <= max_cont) {
		if (verificado == false) {
			if (parseFloat($('div > ul > li > div.multiselect-balance').html().replace("BTC&nbsp;", "")) > 0) {
				martingale();
			} else {
				reset();
			}
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
						// prediction
						if (price_actual < precio) {
							$('#btnCall').click();
							cont = cont + 1;
						}
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
						if (parseFloat(cantidad) > parseFloat(minimo_fuerza)) {
							if (cantidad_old <= cantidad) {
								$('#btnCall').click();
								cont = cont + 1;
							}
						}
					}
					if (accion == "v") {
						// prediction
						if (price_actual > precio) {
							$('#btnPut').click();
							cont = cont + 1;
						}
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
						if (parseFloat(cantidad) < parseFloat(minimo_fuerza)) {
							if (cantidad_old >= cantidad) {
								$('#btnCall').click();
								cont = cont + 1;
							}
						}
					}
				}
				if (accion == "n") {}
				cantidad_old = data[1];
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
	reset();
	setTimeout(function () {
		Ganar();
		loop();
	}, 1000);
}());
