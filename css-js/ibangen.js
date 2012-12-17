var version='1.98', land, aland, sland=0, blz, fi_blz, al_blz, kto, fi_kto, al_kto, lwarten=1, iwarten, vwarten; 

function Land(art)
{ 
	if (art==1)
	{ 
		co1 = new String(getCookie("LAND")); 
		if (co1.length>0)
		{ 
			for(var i=1; i<document.formular.laender.length; i++)
			{ 
				if(co1==document.formular.laender.options[i].value.substr(0,2)) 
				document.formular.laender.options[i].selected=true; 
			} 
		} 
	} 
	
	for(var i=0; i<document.formular.laender.length; i++)
	{ 
		if(document.formular.laender.options[i].selected == true && lwarten>0)
		{ 
			sland=i; aland=document.formular.laender.options[i].text; 
			var code=document.formular.laender.options[i].value; 
			if (hr.substring(20,25)!='de/ib') code=' '; 
			var komma1=code.indexOf(','); 
			var komma2=code.indexOf(',',komma1+1); 
			var komma3=code.indexOf(',',komma2+1); 
			var komma4=code.indexOf(',',komma3+1); 
			var komma5=code.indexOf(',',komma4+1); 
			var komma6=code.indexOf(',',komma5+1); 
			land=code.substring(0,komma1); 
			blz=parseInt(code.substring(komma1+1,komma2)); 
			fi_blz=code.substring(komma2+1,komma3); 
			al_blz=code.substring(komma3+1,komma4); 
			kto=parseInt(code.substring(komma4+1,komma5)); 
			fi_kto=code.substring(komma5+1,komma6); 
			al_kto=code.substring(komma6+1,code.length); 
		} 
	} 
	
	if (art==2) setCookie(); 
	if (art<3)
	{ 
		document.formular.fkto.value=''; 
		document.formular.fblz.value=''; 
		document.formular.eiban.value=''; 
		document.formular.piban.value=''; 
		if (blz=='0') document.formular.fkto.focus(); 
		else document.formular.fblz.focus(); 
	} 
} 
function Ausrichten(feld,laenge,fixedl,alphan,art)
{ 
	var inhalt=feld.value.toUpperCase(), ol=''; 
	if (inhalt.length == 0 && laenge > 0)
	{ 
		if (art > 10) feld.focus(); 
		return false; 
	} 
	if (art > 10) art -= 10; 
	for (var i=0; i<inhalt.length; i++)
	{ 
		if (inhalt.charAt(i)!=' ')
		{ 
			ol += inhalt.charAt(i); 
		} 
	} 
	inhalt = ol; 
	if (art == 3)
	{ 
		if (inhalt.substring(0,4)=='IBAN') 
		inhalt = inhalt.substring(4,inhalt.length); 
		feld.value=inhalt; 
		return true; 
	} 
	if (land == '??' && art == 2)
	{ 
		kto=inhalt.length; laenge=kto; 
	} 
	if (alphan == '0') 
	var zeichen='Ziffern'; 
	else var zeichen='Zeichen'; 
	if (document.formular.pruefen.checked == true)
	{ 
		var tchar; 
		for (var i=0; i<inhalt.length; i++)
		{ 
			tchar=inhalt.charCodeAt(i); 
			if ( (tchar<48 || (tchar>57 && tchar<65) || tchar>90) && alphan=='1')
			{ 
				alert('FEHLER: Nur Ziffern und Buchstaben (keine Umlaute oder Sonderzeichen) erlaubt! '); 
				feld.focus(); 
				return false; 
			}
			else if ( (tchar<48 || tchar>57) && alphan=='0' )
			{ 
				alert('FEHLER: Nur Ziffern erlaubt! '); 
				feld.focus(); 
				return false; 
			} 
		} 
		if ( fixedl=='1' && inhalt.length != laenge )
		{ 
			alert('FEHLER: Feld muss '+laenge+' '+zeichen+' enthalten, aktuell: '+inhalt.length); 
			feld.focus(); 
			return false; 
		}
		else if (inhalt.length > laenge)
		{ 
			alert('FEHLER: Feld darf maximal '+laenge+' '+zeichen+' enthalten, aktuell: '+inhalt.length); 
			feld.focus(); 
			return false; 
		} 
	} 
	if (inhalt.length<laenge && art<3 && document.formular.hinweis.checked==true)
	{ 
		if (art==1) Hinweis(zeichen,laenge,fixedl,'Bankleitzahl'); 
		else Hinweis(zeichen,laenge,fixedl,'Kontonummer'); 
	} 
	var nullen=''; 
	for (var i=0; i<laenge; i++) 
	nullen+='0'; 
	inhalt = nullen+inhalt; 
	feld.value=inhalt.substring(inhalt.length-laenge,inhalt.length); 
	if (hr.length!=45)
	return false; 
	return true; 
} 
function IbanErzeugen()
{ 
	document.formular.piban.value=''; 
	document.formular.eiban.value=''; 
	if (iwarten > 0)
	{ 
		clearTimeout(iwarten); 
		iwarten = 0; 
	} 
	if (Ausrichten(document.formular.fblz,blz,fi_blz,al_blz,11)==false) return false; 
	if (Ausrichten(document.formular.fkto,kto,fi_kto,al_kto,12)==false) return false; 
	if (land=='??') document.formular.eiban.value=document.formular.fkto.value.substring(0,2)+'00'+document.formular.fkto.value.substring(2,document.formular.fkto.value.length); 
	else document.formular.eiban.value=land+'00'+document.formular.fblz.value+document.formular.fkto.value; 
	if (p.substring(22,29)=='/iban/i') ChkIban(2); 
	return true; 
} 
function ChkIban(art)
{ 
	var iban=document.formular.eiban.value.toUpperCase(); 
	if (iban.length==0 || lwarten==0)
	{ 
		document.formular.eiban.focus(); 
		return false; 
	} 
	var tiban=iban; 
	var ochk=tiban.substring(2,4); 
	var tchar; 
	for (var i=0; i<tiban.length; i++)
	{ 
		tchar=tiban.charCodeAt(i); 
		if ( tchar>64 && tchar<91 ) 
		tiban=tiban.substring(0,i)+(tchar-55)+tiban.substring(i+1,tiban.length); 
		else if ( (tchar<48 || (tchar>57 && tchar<65) || tchar>90) && document.formular.pruefen.checked == true)
		{ 
			alert('FEHLER: Nur Ziffern und Buchstaben (keine Umlaute oder Sonderzeichen) erlaubt! '); 
			document.formular.eiban.focus(); 
			return false; 
		} 
	} 
	tiban=tiban.substring(6,tiban.length)+tiban.substring(0,4)+'00'; 
	var tl=9; 
	var chk=''; 
	while (tiban.length>0)
	{ 
		chk=Part(chk+tiban.substr(0,tl)); 
		tiban=tiban.substring(tl,tiban.length); 
		if (chk<10) tl=8; 
		else tl=7; 
	} 
	chk=98-chk; 
	if (chk<10) chk='0'+chk; 
	chk=''+chk; 
	if (chk.length>2)
	{ 
		alert('FEHLER: Nur Ziffern und Buchstaben (keine Umlaute oder Sonderzeichen) erlaubt! '); 
		return false; 
	} 
	if (art==1)
	{ 
		document.formular.laender.options[0].selected=true; 
		for(var i=1; i<document.formular.laender.length; i++)
		{ 
			if(iban.substr(0,2)==document.formular.laender.options[i].value.substr(0,2)) 
			document.formular.laender.options[i].selected=true; 
		} 
		Land(3); 
		if (chk==ochk && (land=='??' || blz+kto+4==iban.length))
		{ 
			alert("IBAN ist korrekt.\n\nLand: "+aland); 
			document.formular.fblz.value=iban.substring(4,4+blz); 
			if (land=='??') 
			document.formular.fkto.value=iban.substring(0,2)+iban.substring(4+blz,iban.length); 
			else document.formular.fkto.value=iban.substring(4+blz,iban.length); 
		}
		else
		{ 
			if (land!='??' && blz+kto+4!=iban.length) 
			alert("IBAN ist falsch!\n\nEine IBAN fur "+aland+" muss inklusive\nLandercode aus "+(blz+kto+4)+" Zeichen bestehen, aktuell: "+iban.length); 
			else alert("IBAN ist falsch!\n\nLand: "+aland); 
			document.formular.piban.value=''; 
			document.formular.fblz.value=''; 
			document.formular.fkto.value=''; 
			return false; 
		} 
	}
	else
	{ 
		if (land=='??') 
		document.formular.eiban.value=iban.substring(0,2)+chk+iban.substring(4,iban.length); 
		else document.formular.eiban.value=land+chk+iban.substring(4,iban.length); 
	} 
	if (land=='TN' || land=='MR') 
	Info(); 
	document.formular.piban.value='IBAN '+ Papier(document.formular.eiban.value); 
	if ( (document.formular.ktopruef.checked == true) && (land == 'DE') ) 
	Ktopruef(document.formular.fblz.value, document.formular.fkto.value); 
	return true; 
} 
function VerwErzeugen()
{ 
	document.formular.pvwzwk.value=''; 
	document.formular.evwzwk.value=''; 
	if (vwarten > 0)
	{ 
		clearTimeout(vwarten); 
		vwarten = 0; 
	} 
	if (Ausrichten(document.formular.vwzwk,18,0,1,14)==false) 
	return false; 
	document.formular.evwzwk.value='00'+document.formular.vwzwk.value; 
	if (p.substring(12,19)=='asy-web')
	ChkVwzwk(2); 
	return true; 
} 
function ChkVwzwk(art){ var vwzwk=document.formular.evwzwk.value.toUpperCase(); if (vwzwk.length==0 || lwarten==0){ document.formular.evwzwk.focus(); return false; } var tvwzwk=vwzwk; var ochk=tvwzwk.substring(0,2); var tchar; for (var i=0; i<tvwzwk.length; i++){ tchar=tvwzwk.charCodeAt(i); if ( tchar>64 && tchar<91 ) tvwzwk=tvwzwk.substring(0,i)+(tchar-55)+tvwzwk.substring(i+1,tvwzwk.length); else if ( (tchar<48 || (tchar>57 && tchar<65) || tchar>90) && document.formular.pruefen.checked == true){ alert('FEHLER: Nur Ziffern und Buchstaben (keine Umlaute oder Sonderzeichen) erlaubt! '); document.formular.evwzwk.focus(); return false; } } tvwzwk=tvwzwk.substring(2,tvwzwk.length)+'00'; var tl=9; var chk=''; while (tvwzwk.length>0){ chk=Part(chk+tvwzwk.substr(0,tl)); tvwzwk=tvwzwk.substring(tl,tvwzwk.length); if (chk<10) tl=8; else tl=7; } chk=98-chk; if (chk<10) chk='0'+chk; chk=''+chk; if (chk=='NaN'){ alert('FEHLER: Nur Ziffern und Buchstaben (keine Umlaute oder Sonderzeichen) erlaubt! '); return false; } if (art==1){ if (chk==ochk && vwzwk.length==20){ alert("Verwendungszweck ist korrekt."); document.formular.vwzwk.value=vwzwk.substring(2,vwzwk.length); }else{ if (vwzwk.length==20) alert("Verwendungszweck ist falsch!"); else alert("Verwendungszweck ist falsch!\n\nDer Verwendungszweck muss aus\n20 Zeichen bestehen, aktuell: "+vwzwk.length); document.formular.pvwzwk.value=''; document.formular.vwzwk.value=''; return false; } }else document.formular.evwzwk.value=chk+vwzwk.substring(2,vwzwk.length); document.formular.pvwzwk.value=Papier(document.formular.evwzwk.value); return true; } function Part(Tstring){ return Tstring % 97; } function Papier(pstring){ var papier=''; var cnt=0; for (var i=0; i<pstring.length; i++){ cnt++; papier+=pstring.substr(i,1); if ( (cnt==4)&&(i<pstring.length-1) ){ papier+=' '; cnt=0; } } return papier; } function setCookie () { var expires = new Date(); expires.setTime (expires.getTime() + (1000*60*60*24*30)); if (document.formular.pruefen.checked == true) document.cookie = "PRUEFEN=; expires=" + expires.toGMTString() + "; path=/"; else document.cookie = "PRUEFEN=nein; expires=" + expires.toGMTString() + "; path=/"; if (document.formular.hinweis.checked == true) document.cookie = "HINWEIS=; expires=" + expires.toGMTString() + "; path=/"; else document.cookie = "HINWEIS=nein; expires=" + expires.toGMTString() + "; path=/"; if (document.formular.ktopruef.checked == true) document.cookie = "KTOPRUEF=; expires=" + expires.toGMTString() + "; path=/"; else document.cookie = "KTOPRUEF=nein; expires=" + expires.toGMTString() + "; path=/"; document.cookie = "LAND="+land+"; expires=" + expires.toGMTString() + "; path=/"; return null; } var hr=''+document.location; function getCookie (coknam) { var doccok = document.cookie; coknam = coknam + "="; var coklen = doccok.length; var cokbgn = 0; while (cokbgn < coklen) { var varbgn = cokbgn + coknam.length; if (doccok.substring(cokbgn, varbgn) == coknam) { var varend = doccok.indexOf (";", varbgn); if (varend == -1) varend = coklen; return unescape(doccok.substring(varbgn, varend)); } cokbgn = doccok.indexOf(" ", cokbgn) + 1; if (cokbgn == 0) break; } return ""; } var email="mai"+"lto:ger"+"hard@"+"easy-"+"web.de"+"?subject=IBAN%20Generator%20"+version; var Meta="<meta name='MSSmartTagsPreventParsing' content='TRUE'><meta http-equiv='content-type' content='text/html; charset=ISO-8859-1'><meta name='author' content='Gerhard Blum'>"; var Body="<body bgcolor='#dddddd' onLoad='focus()'>"; var swiftbic="<a href='http://www.swift.com/bsl/index.faces' target='_blank'>SWIFT-BIC</a>"; function Info() { var text="Kein Infotext vorhanden."; if (land=='??') text="Verwenden Sie (Eigenes Format) f&uuml;r L&auml;nder, die hier nicht aufgef&uuml;hrt sind und deren Code und Format Sie dennoch kennen.<br /><br />Bitte lassen Sie das Feld 'BLZ' leer und geben in das Feld 'Konto' hintereinander Ihren L&auml;ndercode, die Bankleitzahl und die Kontonummer in der jeweils erforderlichen L&auml;nge (evtl. Nullen voranstellen!) ein."; if (land=='AD'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 4-stelligen Bank-Code und den 4-stelligen Branch-Code ein und in das Feld 'Konto' die 12-stellige Kontonummer."; } if (land=='AZ'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Code ein und in das Feld 'Konto' die 20-stellige Kontonummer."; } if (land=='BH'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Code ein und in das Feld 'Konto' die Kontonummer (max. 14 Stellen)."; } if (land=='BE'){ text="Bitte geben Sie in das Feld 'BLZ' die 3-stellige Bankleitzahl ein und in das Feld 'Konto' die 9-stellige Kontonummer."; } if (land=='BA'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 3-stelligen Bank-Code und den 3-stelligen Branch-Code (falls es keine Branches gibt: 3 Nullen) ein und in das Feld 'Konto' die 10-stellige Kontonummer."; } if (land=='BG'){ text="Bitte geben Sie in das Feld 'BLZ' hinereinander den 4-stelligen Bank-Identifier (die ersten 4 Zeichen des "+swiftbic+") und den 4-stelligen Branch-Code ein und in das Feld 'Konto' die 10-stellige Kontonummer."; } if (land=='CR'){ text="Bitte geben Sie in das Feld 'BLZ' den 3-stelligen Bank-Code ein und in das Feld 'Konto' die 14-stellige Kontonummer."; } if (land=='DK' || land=='GL' || land=='FO'){ text="Bitte geben Sie in das Feld 'BLZ' die Bankleitzahl (max. 4 Stellen) ein und in das Feld 'Konto' die Kontonummer (max. 10 Stellen)."; } if (land=='DE'){ text="Bitte geben Sie in das Feld 'BLZ' die 8-stellige Bankleitzahl ein und in das Feld 'Konto' die Kontonummer (max. 10 Stellen)."; } if (land=='DO'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Identifier ein und in das Feld 'Konto' die Kontonummer (max. 20 Stellen)."; } if (land=='EE'){ text="Bitte geben Sie in das Feld 'BLZ' den 2-stelligen Bank-Identifier ein und in das Feld 'Konto' die Kontonummer (max. 14 Stellen)."; } if (land=='FI'){ text="Bitte geben Sie in das Feld 'BLZ' die 6-stellige Bankleitzahl ein und in das Feld 'Konto' die Kontonummer (max. 8 Stellen)."; } if (land=='FR' || land=='MC'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 5-stelligen Bank-Code und den 5-stelligen Branch-Code ein und in das Feld 'Konto' die 13-stellige Kontonummer."; } if (land=='GE'){ text="Bitte geben Sie in das Feld 'BLZ' 2-stelligen Bank-Identifier ein und in das Feld 'Konto' die Kontonummer (max. 16 Stellen)."; } if (land=='GB'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 4-stelligen Bank-Identifier und den 6-stelligen Branch-Code ein und in das Feld 'Konto' die Kontonummer (max. 8 Stellen)."; } if (land=='GI'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Identifier ein (die ersten 4 Zeichen des "+swiftbic+") und in das Feld 'Konto' die Kontonummer (max. 15 Stellen)."; } if (land=='GR'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 3-stelligen Bank-Code (ggf. Nullen voranstellen!) und den 4-stelligen Branch-Code (ggf. Nullen voranstellen!) ein und in das Feld 'Konto' die Kontonummer (max. 16 Stellen)."; } if (land=='IE'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 4-stelligen Bank-Identifier (die ersten 4 Zeichen des "+swiftbic+") und die 6-stellige Bankleitzahl ein und in das Feld 'Konto' die 8-stellige Kontonummer."; } if (land=='IS'){ text="Bitte geben Sie in das Feld 'BLZ' die 4-stellige Bankleitzahl ein und in das Feld 'Konto' hintereinander den 2-stelligen Kontotyp, die 6-stellige Kontonummer und die 10-stellige Kontoidentifikationsnummer."; } if (land=='IL'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 3-stelligen Bank-Code (ggf. Nullen voranstellen!) und den 3-stelligen Branch-Code (ggf. Nullen voranstellen!) ein und in das Feld 'Konto' die Kontonummer (max. 13 Stellen)."; } if (land=='IT' || land=='SM'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 1-stelligen Check-Digit, den 5-stelligen Bank-Code und den 5-stelligen Branch-Code ein und in das Feld 'Konto' die 12-stellige Kontonummer."; } if (land=='VG'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Code ein und in das Feld 'Konto' die 16-stellige Kontonummer."; } if (land=='KZ'){ text="Bitte geben Sie in das Feld 'BLZ' den 3-stelligen Bank-Code ein und in das Feld 'Konto' die 13-stellige Kontonummer."; } if (land=='HR'){ text="Bitte geben Sie in das Feld 'BLZ' den 7-stelligen Bank-Code ein und in das Feld 'Konto' die 10-stellige Kontonummer."; } if (land=='KW'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Code ein und in das Feld 'Konto' die Kontonummer (max. 22 Stellen)."; } if (land=='LB'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Identifier ein und in das Feld 'Konto' die Kontonummer (max. 20 Stellen)."; } if (land=='LV'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Identifier ein (die ersten 4 Zeichen des "+swiftbic+") und in das Feld 'Konto' die 13-stellige Kontonummer."; } if (land=='LI'){ text="Bitte geben Sie in das Feld 'BLZ' die Bankleitzahl (max. 5 Stellen) ein und in das Feld 'Konto' die Kontonummer (max. 12 Stellen)."; } if (land=='LT'){ text="Bitte geben Sie in das Feld 'BLZ' die 5-stellige Bankleitzahl ein und in das Feld 'Konto' die 11-stellige Kontonummer."; } if (land=='LU'){ text="Bitte geben Sie in das Feld 'BLZ' die 3-stellige Bankleitzahl ein und in das Feld 'Konto' die 13-stellige Kontonummer."; } if (land=='MT'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 4-stelligen Bank-Identifier und den 5-stelligen Bank-Code ein und in das Feld 'Konto' die Kontonummer (max. 16 Stellen, wird automatisch mit f&uuml;hrenden Nullen auf 18 Stellen erweitert)."; } if (land=='ME'){ text="Bitte geben Sie in das Feld 'BLZ' die 3-stellige Bankleitzahl ein und in das Feld 'Konto' die 15-stellige Kontonummer.<br />(Bei 18-stelliger Kontonummer sind die ersten drei Ziffern die BLZ)"; } if (land=='MR'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 5-stelligen Bank-Code und den 5-stelligen Branch-Code (ggf. Nullen voranstellen!) ein und in das Feld 'Konto' die 13-stelligen Kontonummer.<br /><b>Aufgrund des mauretanischen Pr&uuml;fzifferverfahrens beginnt jede korrekte mauretanischen IBAN mit '<font color='#ff0000'>MR13...</font>'</b>"; } if (land=='MD'){ text="Bitte geben Sie in das Feld 'BLZ' den 2-stelligen Bank-Code ein und in das Feld 'Konto' die 18-stellige Kontonummer."; } if (land=='MU'){ text="<b>Leider liegen z.Zt. nur wenig Infos vor:</b><br />Bitte lassen Sie b.a.w. das Feld 'BLZ' leer und geben in das Feld 'Konto' die insgesamt 26-stellige BBAN ein. Diese beginnt mit 4 Buchstaben und endet mit 3 Buchstaben."; } if (land=='NL'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Identifier ein (die ersten 4 Zeichen des "+swiftbic+") und in das Feld 'Konto' die Kontonummer (max. 10 Stellen)."; } if (land=='NO'){ text="Bitte geben Sie in das Feld 'BLZ' die 4-stellige Bankleitzahl ein und in das Feld 'Konto' die 7-stellige Kontonummer."; } if (land=='AT'){ text="Bitte geben Sie in das Feld 'BLZ' die 5-stellige Bankleitzahl ein und in das Feld 'Konto' die Kontonummer (max. 11 Stellen)."; } if (land=='PL'){ text="Bitte geben Sie in das Feld 'BLZ' die 8-stellige Bankleitzahl ein und in das Feld 'Konto' die Kontonummer (max. 16 Stellen)."; } if (land=='PT'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 4-stelligen Bank-Code und den 4-stelligen Branch-Code ein und in das Feld 'Konto' die 13-stellige Kontonummer."; } if (land=='RO'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen Bank-Identifier ein (die ersten 4 Zeichen des "+swiftbic+") und in das Feld 'Konto' die 16-stellige Kontonummer."; } if (land=='SA'){ text="Bitte geben Sie in das Feld 'BLZ' die 2-stellige Bankleitzahl ein und in das Feld 'Konto' die Kontonummer (max. 18 Stellen)."; } if (land=='SE'){ text="Bitte geben Sie in das Feld 'BLZ' die 3-stellige Bankleitzahl ein und in das Feld 'Konto' die Kontonummer (max. 17 Stellen)."; } if (land=='CH'){ text="Bitte geben Sie in das Feld 'BLZ' die Bankleitzahl (max. 5 Stellen) ein und in das Feld 'Konto' die Kontonummer (max. 12 Stellen)."; } if (land=='CS'){ text="Bitte geben Sie in das Feld 'BLZ' die 3-stellige Bankleitzahl ein und in das Feld 'Konto' die 15-stellige Kontonummer.<br />(Bei 18-stelliger Kontonummer sind die ersten drei Ziffern die BLZ)"; } if (land=='SK'){ text="Bitte geben Sie in das Feld 'BLZ' den 4-stelligen numerischen Teil der Bankleitzahl ein und in das Feld 'Konto' hintereinander den 6-stelligen 1. Teil (ggf. Nullen voranstellen!) und den 10-stelligen 2. Teil der Kontonummer (ggf. Nullen voranstellen!)."; } if (land=='SI'){ text="Bitte geben Sie in das Feld 'BLZ' die 5-stellige Bankleitzahl ein und in das Feld 'Konto' die 10-stellige Kontonummer."; } if (land=='ES'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 4-stelligen Bank-Code, den 4-stelligen Branch-Code und den 2-stelligen Check-Code ein und in das Feld 'Konto' die 10-stellige Kontonummer."; } if (land=='CZ'){ text="Bitte geben Sie in das Feld 'BLZ' die 4-stellige Bankleitzahl ein und in das Feld 'Konto' hintereinander den 6-stelligen 1. Teil (ggf. Nullen voranstellen!) und den 10-stelligen 2. Teil der Kontonummer (ggf. Nullen voranstellen!)."; } if (land=='TR'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 5-stelligen Bank-Code und eine Null ein und in das Feld 'Konto' die Kontonummer (max. 16 Stellen)."; } if (land=='TN'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 2-stelligen Bank-Code und den 3-stelligen Branch-Code (ggf. Nullen voranstellen!) ein und in das Feld 'Konto' die 15-stelligen Kontonummer.<br /><b>Aufgrund des tunesischen Pr&uuml;fzifferverfahrens beginnt jede korrekte tunesische IBAN mit '<font color='#ff0000'>TN59...</font>'</b>"; } if (land=='HU'){ text="Bitte geben Sie in das Feld 'BLZ' die 8-stellige Bankleitzahl ein und in das Feld 'Konto' die 16-stellige Kontonummer (bei achtstelliger Kontonummer 8 Nullen anhangen!)."; } if (land=='AE'){ text="Bitte geben Sie in das Feld 'BLZ' die 3-stellige Bankleitzahl ein und in das Feld 'Konto' die 16-stellige Kontonummer."; } if (land=='CY'){ text="Bitte geben Sie in das Feld 'BLZ' hintereinander den 3-stelligen Bank-Code und den 5-stelligen Branch-Code ein und in das Feld 'Konto' die Kontonummer (max. 16 Stellen)."; } if (land!='??'){ var swiftiban="http://www.swift.com/dsp/resources/documents/IBAN_Registry.pdf"; text += "<br /><br /><a href='"+swiftiban+"' target='_blank'>Weitere&nbsp;Infos&nbsp;f&uuml;r&nbsp;"+aland+"</a>&nbsp;("+land+")"; text += "<br /><font size=1>(in englisch, Internetverbindung und<br /><a href='http://get.adobe.com/de/reader/' target='_blank'>Adobe Reader</a> wird hierzu ben&ouml;tigt)</font>"; } var fenster = open("", "Info", "width=400,height=220,scrollbars=yes,resizable=yes"); fenster.document.open(); with (fenster.document){ write("<html><head>"+Meta+"<title>"+aland+" ("+land+")</title></head>"); write(Body+text+"</body></html>"); } fenster.document.close(); } function Hinweis(zeichen,laenge,fixedl,art) { var fenster = open("", "Hinweis", "width=400,height=230,scrollbars=yes,resizable=yes"); fenster.document.open(); with (fenster.document){ write("<html><head>"+Meta+"<title>Hinweis</title></head>"); write(Body+"<b>Wichtiger Hinweis:</b><br /><br />Die eingegebene "+art+" hat weniger als "+laenge+" "+zeichen+" und wurde automatisch mit f&uuml;hrenden Nullen aufgef&uuml;llt.<br /><br />"); if (fixedl=='0'){ write("Dies ist zwar in den meisten F&auml;llen genau richtig, vergewissern Sie sich aber am besten dennoch, ob diese Nummer so auch wirklich korrekt ist"); if (art=='Kontonummer') write(" oder ob z.B. noch eine 'Unterkonto-Nummer' gefehlt hat"); write(", die IBAN wird sonst falsch berechnet."); }else write("<font color='#ff0000'>Ihre Eingabe ist h&ouml;chstwahrscheinlich falsch, da eine "+art+" f&uuml;r "+aland+" aus "+laenge+" "+zeichen+" bestehen muss!</font>"); write("</body></html>"); } fenster.document.close(); } function Nutzungsbedingung() { var fenster = open("", "Nutzung", "width=420,height=360,scrollbars=yes,resizable=yes"); fenster.document.open(); with (fenster.document){ write("<html><head>"+Meta+"<title>Nutzungsbedingung IBAN Generator</title></head>"); write(Body+"F&uuml;r den <b>privaten</b> Gebrauch ist dieses Programm kostenlos.<br /><br />Wenn Sie es anderweitig verwenden, lizenzieren Sie es bitte, indem Sie mir einmalig den Betrag von &euro;&nbsp;5,- pro Arbeitsplatz, an dem das Programm genutzt wird, &uuml;berweisen.<br />Schauen Sie sich die genauen <a href='http://www.easy-web.de/iban/lizenz.txt' target='_blank'>Lizenzbestimmungen</a> an (Internetverbindung wird hierzu ben&ouml;tigt), vor allem f&uuml;r eine Nutzung an mehr als 50 Arbeitspl&auml;tzen oder im Rahmen einer Internet-Pr&auml;senz.<br /><br />Gerhard Blum<br />Sparkasse Darmstadt (Deutschland)<br />BLZ: 508 501 50<br />Kto: 109 017 426<br />IBAN DE89 5085 0150 0109 0174 26<br />SWIFT-BIC: HELADEF1DAS<br />Verwendungszweck: IBAN Generator</body></html>"); } fenster.document.close(); } function Ktopruef(blz,kto) { var fenster = open("", "KontoPruef", "width=660,height=380,resizable=yes,toolbar=yes,status=yes,scrollbars=yes"); fenster.document.open(); with (fenster.document){ write("<html><head>"+Meta+"<title>Bankverbindungspr&uuml;fung</title></head>"); write(Body+"Die Kontonummer <b>"+kto+"</b> unter der BLZ <b>"+blz+"</b> kann jetzt online &uuml;ber eine unverschl&uuml;&szlig;elte Verbindung gepr&uuml;ft werden, hierbei wird die BLZ auf Existenz und die Kontonummer auf ihre Pr&uuml;fziffer getestet.<br /><br />Ein positives Ergebnis ist aber immer noch keine Garantie, dass das Konto bei dieser Bank auch wirklich existiert.<br /><br /><form name='pruef' action='http://www.kontopruef.de/bank' method='GET'><input type=hidden name='BLZ' value='"+blz+"'><input type=hidden name='KTO' value='"+kto+"'><input type=submit value='Bankverbindung pr&uuml;fen'></form><br /><hr><br />Diese und andere hilfreiche Funktionen und Utilities hat der Pr&uuml;fziffernexperte <A HREF='http://www.kontopruef.de/' TARGET='_blank'>Matthias Hanft auf seiner Bankenseite</A>, ausserdem dort jetzt f&uuml;r Programmierer: Eine vollst&auml;ndige Bankverbindungspr&uuml;fung als DLL zum Einbau in eigene Programme.</body></html>"); } 
		fenster.document.close(); 
		} 