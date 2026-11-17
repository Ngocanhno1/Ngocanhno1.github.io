/* Gắn ảnh khuôn mặt thật của Lucie và Lucas (img/lucie.webp, img/lucas.webp) lên đầu nhân vật 3D.
   Dùng: MatThat.dan(nhomDau, "lucie", { r: 0.45, y: 0.45, z: 0.5 })  -> trả về tấm mặt (Mesh)
         MatThat.url("lucas")  -> đường dẫn ảnh mặt để dùng trong <img> */
(function () {
  var me = document.currentScript;
  var GOC = me ? me.src.replace(/games\/anh-chung\/mat-that\.js.*$/, "") : "/";
  var tex = {};
  window.MatThat = {
    url: function (ai) { return GOC + "img/" + ai + ".webp"; },
    dan: function (dau, ai, o) {
      if (!window.THREE || !dau) return null;
      o = o || {};
      if (!tex[ai]) tex[ai] = new THREE.TextureLoader().load(this.url(ai));
      var m = new THREE.Mesh(new THREE.CircleGeometry(o.r || 0.45, 48),
        new THREE.MeshBasicMaterial({ map: tex[ai], transparent: true, alphaTest: 0.05 }));
      m.position.set(o.x || 0, o.y || 0, o.z || 0);
      m.renderOrder = 2;
      dau.add(m);
      return m;
    }
  };
})();
