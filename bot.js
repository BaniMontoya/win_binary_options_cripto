minimo_solo = 80;
minimo_duo = 75;
minimo_suma_compra = 133;
minimo_suma_venta = 133;
rand = 1320;
ultima_jugada = $('#price-pointer-value').html().replace(" ", "").split('.')[0];
call_btn = $('#btnCall');
put_btn = $('#btnPut');
close_all_noti = $('#close_all');
cont = 0;
max_cont = 1;
balance = 0.0;
min_money = "0.00000005";
verificado = false;

function Ganar() {
	if ($('#btnCall').hasClass('btn-disabled') == false && cont <= max_cont) {
		url = "https://super-trading.tk/technicals/BTCUSD/";
		$.ajax({
			url: url,
			success: function (data) {
				accion = data[0];
				prediccion = data.split(", ")[1];
				potencia = data[1];
				volumen_top = parseFloat($('#volumes-top').html());
				orders_top = $('#orders-top').html();
				volumen_bottom = $('#volumes-bottom').html();
				orders_bottom = $('#orders-bottom').html();
				$('.notif_item-close').click();
				price_actual = $('#price-pointer-value');
				predice = -1;
				if (price_actual > prediccion && potencia > 2 && price_actual - prediccion > 30) {
					predice = 0;
				}
				if (price_actual < prediccion && potencia > 2 && prediccion - price_actual > 30) {
					predice = 1;
				}

				function martingale() {
					if (ultima_cerrada < 0) {
						$('#bid_amount_buttons > input:nth-child(3)').click();
					} else {
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(4)').click();
						$('#bid_amount_buttons > input:nth-child(3)').click();
						$('#bid_amount_buttons > input:nth-child(3)').click();
						$('#bid_amount_buttons > input:nth-child(3)').click();
						$('#bid_amount_buttons > input:nth-child(3)').click();
					}
				}
				if (accion == "c" && predice == 1 && potencia > 2) {
					//SUMA COMPRA
					if (parseFloat(parseFloat(volumen_top) + parseFloat(orders_top)) > minimo_suma_compra) {
						martingale();
						$('#btnCall').click();
						cont = cont + 1;
					}
					//DUO COMPRA
					if (parseFloat(volumen_top) > minimo_duo && parseFloat(orders_top) > minimo_duo) {
						martingale();
						$('#btnCall').click();
						cont = cont + 1;
					}
					//SOLO COMPRA
					if (parseFloat(volumen_top) > minimo_solo || parseFloat(orders_top) > minimo_solo) {
						//if (ultima_jugada > parseFloat(price_actual.html().replace(" ", "").split('.')[0])) {
						//{
						martingale();
						$('#btnCall').click();
						cont = cont + 1;
						//}
						//}
					}
				}
				if (accion == "v" && predice == 0 && potencia > 2) {
					//SUMA VENTA
					if (parseFloat(parseFloat(volumen_bottom) + parseFloat(orders_bottom)) > minimo_suma_venta) {
						martingale();
						$('#btnPut').click();
						cont = cont + 1;
					}
					//DUO VENTA
					if (parseFloat(volumen_bottom) > minimo_duo && parseFloat(orders_bottom) > minimo_duo) {
						$('#btnPut').click();
						cont = cont + 1;
					}
					//SOLO VENTA
					if (parseFloat(volumen_bottom) > minimo_solo || parseFloat(orders_bottom) > minimo_solo) {
						//if (ultima_jugada < parseFloat(price_actual.html().replace(" ", "").split('.')[0])) {
						$('#btnPut').click();
						cont = cont + 1;
						//}
					}
				}
			}
		});
	} else {
		cont = 0;
	}
	try {
		ultima_jugada = parseFloat(price_actual.html().replace(" ", "").split('.')[0]);
		balance = parseFloat($('#header_btns > div > div > ul > li > div.multiselect-balance').html().replace("&nbsp;BTC", ""));
	} catch (error) {}
}
(function loop() {
	setTimeout(function () {
		Ganar();
		loop();
	}, rand);
}());
setTimeout(function () {
	$('#dealsButtonsRegion > ul > li:nth-child(2) > span').click();
	setTimeout(function () {
		ultima_cerrada = parseFloat($('#scroll-container > table > tbody > tr:nth-child(1) > td:last').html().replace("BTC&nbsp;", ""));
	}, rand * 7);
}, rand * 20);
