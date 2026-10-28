
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let savat = [];
let tanlangan = null;
let bildirishVaqti;

function pul(son) {
    return son.toLocaleString("uz-UZ") + " so‘m";
}

function xabar(matn) {
    $("#bildirish").textContent = matn;
    $("#bildirish").classList.add("ochiq");
    clearTimeout(bildirishVaqti);
    bildirishVaqti = setTimeout(() => {
        $("#bildirish").classList.remove("ochiq");
    }, 2500);
}

function savatniChiz() {
    $("#savatSoni").textContent = savat.reduce((jami, item) => jami + item.soni, 0);

    if (savat.length === 0) {
        $("#savatMahsulotlar").innerHTML = '<p class="bosh-savat">Hozircha savatchangiz bo‘sh.</p>';
    } else {
        $("#savatMahsulotlar").innerHTML = savat.map((item, index) => `
            <div class="savat-element">
                <div>
                    <h3>${item.nom}</h3>
                    <p>${pul(item.narx)} × ${item.soni}</p>
                </div>
                <button data-ochir="${index}">O‘chirish ✕</button>
            </div>
        `).join("");
    }

    $("#jami").textContent = pul(savat.reduce((jami, item) => jami + item.narx * item.soni, 0));
}

function savatgaQosh(nom, narx) {
    const bor = savat.find(item => item.nom === nom);

    if (bor) {
        bor.soni++;
    } else {
        savat.push({ nom, narx, soni: 1 });
    }

    savatniChiz();
    xabar(nom + " savatchaga qo‘shildi!");
}

function savatniOch() {
    $("#savat").classList.add("ochiq");
    $("#qoplama").classList.add("ochiq");
}

function yop() {
    $("#savat").classList.remove("ochiq");
    $("#qoplama").classList.remove("ochiq");
    $("#mahsulotModal").classList.remove("ochiq");
}

$("#savatOch").onclick = savatniOch;
$("#savatYop").onclick = yop;
$("#qoplama").onclick = yop;
$("#modalYop").onclick = yop;

$$(".qoshish").forEach(tugma => {
    tugma.onclick = () => savatgaQosh(tugma.dataset.nom, Number(tugma.dataset.narx));
});

$$(".filtr").forEach(tugma => {
    tugma.onclick = () => {
        $$(".filtr").forEach(f => f.classList.remove("faol"));
        tugma.classList.add("faol");

        $$(".mahsulot").forEach(mahsulot => {
            const mos = tugma.dataset.tur === "barchasi" || mahsulot.dataset.tur === tugma.dataset.tur;
            mahsulot.classList.toggle("yashirin", !mos);
        });
    };
});

$$(".korish").forEach(tugma => {
    tugma.onclick = () => {
        tanlangan = {
            nom: tugma.dataset.nom,
            narx: Number(tugma.dataset.narx)
        };

        $("#modalNom").textContent = tanlangan.nom;
        $("#modalNarx").textContent = pul(tanlangan.narx);
        $("#modalRasm").src = tugma.dataset.rasm;
        $("#mahsulotModal").classList.add("ochiq");
    };
});

$("#modalQosh").onclick = () => {
    if (tanlangan) {
        savatgaQosh(tanlangan.nom, tanlangan.narx);
        yop();
    }
};

$("#savatMahsulotlar").onclick = e => {
    const tugma = e.target.closest("[data-ochir]");

    if (tugma) {
        savat.splice(Number(tugma.dataset.ochir), 1);
        savatniChiz();
        xabar("Mahsulot savatchadan o‘chirildi.");
    }
};

$("#buyurtma").onclick = () => {
    if (savat.length === 0) {
        xabar("Avval savatchaga mahsulot qo‘shing.");
        return;
    }

    const buyurtmaMatni = savat.map(item =>
        item.nom + " — " + item.soni + " dona — " + pul(item.narx * item.soni)
    ).join("\n");

    const jami = savat.reduce((sum, item) => sum + item.narx * item.soni, 0);

    xabar("Buyurtmangiz tayyorlandi. Jami: " + pul(jami));
    alert("Buyurtma tarkibi:\n\n" + buyurtmaMatni + "\n\nJami: " + pul(jami));
};

$("#aloqaFormasi").onsubmit = e => {
    e.preventDefault();
    $("#formaNatija").textContent = "Rahmat, " + $("#ism").value + "! Xabaringiz qabul qilindi.";
    e.target.reset();
};

savatniChiz();
