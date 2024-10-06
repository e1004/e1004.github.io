//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
lisaKorviNupud.forEach((lisaKorviNupp) => {
  lisaKorviNupp.addEventListener("click", () => {
    const toodeInfo = lisaKorviNupp.parentNode;
    const toode = {
      nimi: toodeInfo.querySelector(".toode_nimi").innerText,
      hind: toodeInfo.querySelector(".toode_hind").innerText,
      kogus: 1,
    };
    const onKorvis =
      korv.filter((korvArtikkel) => korvArtikkel.nimi === toode.nimi).length >
      0;
    if (!onKorvis) {
      lisaArtikkel(toode); // selle funktsiooni loome allpool
      korv.push(toode);
      arvutaSumma();
      nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
    }
    arvutaSumma();
  });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
  korviSisu.insertAdjacentHTML(
    "beforeend",
    `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>
      <div class="korv_artikkel_buttons">
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `
  );

  arvutaSumma();
  lisaKorviJalus(); // selle funktsiooni lisame allpool
  if (!document.getElementById("kokku_tasuda")) {
    korviSisu.insertAdjacentHTML(
      "afterend",
      `
    <h3 id="kokku_tasuda">Kokku tasuda: €0.00</h3>
    `
    );
  }
  arvutaSumma();
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
  lisaKorviNupp.innerText = "Ostukorvis";
  lisaKorviNupp.disabled = true;

  const korvArtiklidD = korviSisu.querySelectorAll(".korv_artikkel");
  korvArtiklidD.forEach((korvArtikkelD) => {
    if (
      korvArtikkelD.querySelector(".korv_artikkel_nimi").innerText ===
      toode.nimi
    ) {
      korvArtikkelD
        .querySelector('[data-action="suurenda_artikkel"]')
        .addEventListener("click", () =>
          suurendaArtikkel(toode, korvArtikkelD)
        );
        arvutaSumma();
      korvArtikkelD
        .querySelector('[data-action="vahenda_artikkel"]')
        .addEventListener("click", () =>
          vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp)
        );
        arvutaSumma();
      korvArtikkelD
        .querySelector('[data-action="eemalda_artikkel"]')
        .addEventListener("click", () =>
          eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp)
        );
        arvutaSumma();
    }
    arvutaSumma();
  });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
  korv.forEach((korvArtikkel) => {
    if (korvArtikkel.nimi === toode.nimi) {
      korvArtikkelD.querySelector(".korv_artikkel_kogus").innerText =
        ++korvArtikkel.kogus;
      arvutaSumma();
    }
  });
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
  korv.forEach((korvArtikkel) => {
    if (korvArtikkel.nimi === toode.nimi) {
      if (korvArtikkel.kogus > 1) {
        korvArtikkel.kogus--;
        korvArtikkelD.querySelector(".korv_artikkel_kogus").innerText = korvArtikkel.kogus;
      } else {
        eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
      }
      arvutaSumma();
    }
  });
}



//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
  korvArtikkelD.remove();
  korv = korv.filter((korvArtikkel) => korvArtikkel.nimi !== toode.nimi);

  if (lisaKorviNupp) {
    lisaKorviNupp.innerText = "Lisa ostukorvi";
    lisaKorviNupp.disabled = false;
  }

  arvutaSumma();
  if (korv.length < 1) {
    document.querySelector(".korv-jalus").remove();
  }
}


//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
  if (document.querySelector(".korv-jalus") === null) {
    korviSisu.insertAdjacentHTML(
      "afterend",
      `
      <div class="korv-jalus">
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `
    );
    document
      .querySelector('[data-action="tyhjenda_korv"]')
      .addEventListener("click", () => tuhjendaKorv());
    document
      .querySelector('[data-action="kassa"]')
      .addEventListener("click", () => kassa());
  }
  arvutaSumma();
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
  korviSisu.querySelectorAll(".korv_artikkel").forEach((korvArtikkelD) => {
    korvArtikkelD.remove();
  });
  document.querySelector(".korv-jalus").remove();
  korv = [];

  lisaKorviNupud.forEach((lisaKorviNupp) => {
    lisaKorviNupp.innerText = "Lisa ostukorvi";
    lisaKorviNupp.disabled = false;
  });

  arvutaSumma();
}



//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function arvutaSumma() {
  let summa = 0;
  korv.forEach((korvArtikkel) => {
    const hind = parseFloat(korvArtikkel.hind.replace("€", "").trim());
    summa += hind * korvArtikkel.kogus;
  });

  const summaElement = document.getElementById("kokku_tasuda");
  if (summaElement) {
    summaElement.innerText = `Kokku tasuda: €${summa.toFixed(2)}`;
  }
}


//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
  let start = Date.now(),
    vahe,
    minutid,
    sekundid;

  function taimer() {
    let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

    let minutid = Math.floor(vahe / 60);
    let sekundid = Math.floor(vahe % 60);

    if (minutid < 10) {
      minutid = "0" + minutid;
    }
    if (sekundid < 10) {
      sekundid = "0" + sekundid;
    }

    kuva.textContent = minutid + ":" + sekundid;

    if (vahe < 0) {
      clearInterval(vahe);
      document.getElementById("time").innerHTML = "alusta uuesti";
    }
  }
  taimer();
  setInterval(taimer, 1000);
}

window.onload = function () {
  let taimeriAeg = 60 * 2,
    kuva = document.getElementById("time");
  alustaTaimer(taimeriAeg, kuva);
};

//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const kinnitus = document.getElementById("kinnitus");
const county = document.getElementById("county");

const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const errors = [];

  if (eesnimi.value.trim() === "") {
    errors.push("Sisesta eesnimi");
  } else if (/\d/.test(eesnimi.value)) {
    errors.push("Eesnimes ei tohi olla numbreid");
  }

  if (perenimi.value.trim() === "") {
    errors.push("Sisesta perenimi");
  } else if (/\d/.test(perenimi.value)) {
    errors.push("Perenimes ei tohi olla numbreid");
  }

  if (telefon.value.trim() === "") {
    errors.push("Sisesta telefon");
  } else if (telefon.value.length < 6 || !/^\d+$/.test(telefon.value)) {
    errors.push("Telefon peab olema vähemalt 6 numbrit");
  }

  const lemmikValitud = document.querySelector('input[name="tarneviis"]:checked');
  if (!lemmikValitud) {
    errors.push("Vali üks tarneviis");
  }

  if (!kinnitus.checked) {
    errors.push("Palun nõustu tingimustega");
  }

  if (errors.length > 0) {
    e.preventDefault();
    errorMessage.innerHTML = errors.join(", ");
  } else {
    errorMessage.innerHTML = "";
  }

  // minu kood
  if (county.value === "") {
    errors.push("Vali linn");
  }

  if (errors.length > 0) {
    e.preventDefault();
    errorMessage.innerHTML = errors.join(", ");
  } else {
    errorMessage.innerHTML = "";
  }
});
