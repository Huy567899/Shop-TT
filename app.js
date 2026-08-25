const PACKS=[
 {name:"Gói 1",price:290000},
 {name:"Gói 2",price:420000},
 {name:"Gói 3",price:750000},
 {name:"Gói 4",price:990000},
 {name:"Gói 5",price:1200000}
];
let selected=null;
const $=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat("vi-VN").format(n);

$("packages").innerHTML=PACKS.map((p,i)=>`<div class="package" data-i="${i}">🎀<div>${p.name}</div><b>${fmt(p.price)}đ</b></div>`).join("");
document.querySelectorAll(".package").forEach(el=>el.onclick=()=>{
 document.querySelectorAll(".package").forEach(x=>x.classList.remove("active"));
 el.classList.add("active"); selected=PACKS[+el.dataset.i];
});

function makeId(){return "TT"+Date.now().toString().slice(-10)}
function save(order){const a=JSON.parse(localStorage.getItem("shoptt_orders")||"[]");a.push(order);localStorage.setItem("shoptt_orders",JSON.stringify(a))}
function getOrders(){return JSON.parse(localStorage.getItem("shoptt_orders")||"[]")}

$("create").onclick=()=>{
 const tid=$("tiktokId").value.trim();
 if(!selected)return alert("Bạn hãy chọn gói xu.");
 if(!tid)return alert("Bạn hãy nhập ID TikTok.");
 const id=makeId();
 const order={id,tiktokId:tid,package:selected.name,price:selected.price,status:"Chờ thanh toán",createdAt:new Date().toLocaleString("vi-VN")};
 save(order);
 $("oid").textContent=id;$("tid").textContent=tid;$("pack").textContent=selected.name+" • "+fmt(selected.price)+"đ";
 $("amount").textContent=fmt(selected.price);$("info").textContent=id;
 // VietQR: dynamic amount + order code.
 $("qr").src=`https://img.vietqr.io/image/MB-0785818099-compact2.png?amount=${selected.price}&addInfo=${encodeURIComponent(id)}&accountName=${encodeURIComponent("LE VAN HUY")}`;
 $("payment").classList.remove("hidden");$("payment").scrollIntoView({behavior:"smooth"});
};

$("done").onclick=()=>{
 const id=$("oid").textContent;
 const a=getOrders();const o=a.find(x=>x.id===id);
 if(o){o.status="Khách báo đã chuyển khoản";localStorage.setItem("shoptt_orders",JSON.stringify(a));}
 alert("Đã ghi nhận thông báo. Admin cần xác nhận giao dịch trước khi hoàn tất đơn.");
};

$("search").onclick=()=>{
 const id=$("searchOrder").value.trim();const o=getOrders().find(x=>x.id===id);
 $("result").innerHTML=o?`<div class="status"><b>${o.id}</b><br>ID TikTok: ${o.tiktokId}<br>${o.package} • ${fmt(o.price)}đ<br>Trạng thái: <b>${o.status}</b><br>Thời gian: ${o.createdAt}</div>`:`<div class="status">Không tìm thấy đơn hàng trên thiết bị này.</div>`;
};
