/* Thông tin của hai chị em — NGUỒN DUY NHẤT cho mọi game. Lên lớp mới chỉ cần sửa ở đây.
   Trong HTML: <span data-hs="lucie.goi">Tường San</span> sẽ tự lấy giá trị từ đây. */
window.HS = {
  truong: "Trường TH&THCS Chu Văn An",
  lucie: { ten: "Nguyễn Ngọc Tường San", goi: "Tường San", lop: "3A6", khoi: 3 },
  lucas: { ten: "Nguyễn Ngọc Tường Minh", goi: "Tường Minh", lop: "1A5", khoi: 1 }
};
(function () {
  function fill() {
    document.querySelectorAll("[data-hs]").forEach(function (e) {
      var v = e.getAttribute("data-hs").split(".").reduce(function (o, k) { return o && o[k]; }, window.HS);
      if (v != null) e.textContent = v;
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill); else fill();
})();
