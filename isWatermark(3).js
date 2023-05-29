// 移除水印方法
function RemoveTpWatermark () {
  // 判断水印是否存在，如果存在，那么执行
  if (document.getElementById("tp-watermark") == null) {
    return;
  }
  document.body.removeChild(document.getElementById("tp-watermark"));
}

function TpWatermark (
  text,
  Uid,
  Ip,
  Mac,
  Machine,
  Account,
  Time,
  H,
  W,
  fontFamily,
  fontSize,
  FontMode,
  color,
  fontGradient,
  FontTransparency
) {
  // 判断水印是否存在，如果存在，那么不执行
  // if (document.getElementById("tp-watermark") != null) {
  //   return;
  // }
  RemoveTpWatermark()
  if (FontMode === 0) {
    let defaultSettings = {
      watermark_id: 'wm_div_id',          // 水印总体的id
      watermark_prefix: 'mask_div_id',    // 小水印的id前缀
      watermark_txt: '测试水印',             // 水印的内容
      watermark_x: 20,                     // 水印起始位置x轴坐标
      watermark_y: 40,                     // 水印起始位置Y轴坐标
      watermark_rows: 0,                   // 水印行数
      watermark_cols: 0,                   // 水印列数
      watermark_x_space: 100,              // 水印x轴间隔
      watermark_y_space: 30,               // 水印y轴间隔
      watermark_font: fontFamily,           // 水印字体
      watermark_color: color,            // 水印字体颜色
      watermark_fontsize: fontSize,          // 水印字体大小
      watermark_alpha: 1,               // 水印透明度，要求设置在大于等于0.005
      watermark_width: 180,                // 水印宽度
      watermark_height: 130,               // 水印长度
      watermark_angle: 0,                 // 水印倾斜度数
      watermark_parent_width: 0,      // 水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
      watermark_parent_height: 0,     // 水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
      watermark_parent_node: null     // 水印插件挂载的父元素element,不输入则默认挂在body上
    };

    // 加载水印
    const innerLoadMark = function (settings = {}) {

      defaultSettings = {
        ...defaultSettings,
        ...settings,
      };

      // 如果元素存在则移除
      let watermark_element = document.getElementById(defaultSettings.watermark_id);
      if (watermark_element) {
        let _parentElement = watermark_element.parentNode;
        if (_parentElement) {
          _parentElement.removeChild(watermark_element);
        }
      }


      // 获取页面最大宽度
      let page_width = Math.max(document.body.scrollWidth, document.body.clientWidth) - defaultSettings.watermark_width / 2;
      // 获取页面最大长度
      let page_height = Math.max(document.body.scrollHeight, document.body.clientHeight, document.documentElement.clientHeight) - defaultSettings.watermark_height / 2;

      let setting = arguments[0] || {};
      let parentEle = defaultSettings.watermark_parent_node;

      let page_offsetTop = 0;
      let page_offsetLeft = 0;


      if (setting.watermark_parent_width || setting.watermark_parent_height) {
        if (setting.watermark_parent_width) {
          page_width = setting.watermark_parent_width - defaultSettings.watermark_width / 2;
        } else {
          if (defaultSettings.watermark_parent_node) {
            page_width = parentEle.offsetWidth - defaultSettings.watermark_width / 2;
          } else {
            page_width = 0;
          }
        }

        if (setting.watermark_parent_height) {
          page_height = setting.watermark_parent_height - defaultSettings.watermark_height / 2;
        } else {
          if (defaultSettings.watermark_parent_node) {
            page_height = Math.max(parentEle.offsetHeight, parentEle.scrollHeight) - defaultSettings.watermark_height / 2;
          } else {
            page_height = 0;
          }
        }

        // setting.watermark_parent_width ? (page_width = setting.watermark_parent_width - defaultSettings.watermark_width / 2) : (defaultSettings.watermark_parent_node) ? (page_width = parentEle.offsetWidth - defaultSettings.watermark_width / 2) : 0;
        // setting.watermark_parent_height ? (page_height = setting.watermark_parent_height - defaultSettings.watermark_height / 2) : (defaultSettings.watermark_parent_node) ? (page_height = Math.max(parentEle.offsetHeight, parentEle.scrollHeight) - defaultSettings.watermark_height / 2) : 0;

        // 指定父元素同时指定了宽或高
        if (parentEle) {
          page_offsetTop = parentEle.offsetTop || 0;
          page_offsetLeft = parentEle.offsetLeft || 0;
          defaultSettings.watermark_x = defaultSettings.watermark_x + page_offsetLeft;
          defaultSettings.watermark_y = defaultSettings.watermark_y + page_offsetTop;
        }
      } else {
        if (parentEle) {
          page_offsetTop = parentEle.offsetTop || 0;
          page_offsetLeft = parentEle.offsetLeft || 0;
          page_width = parentEle.offsetWidth - defaultSettings.watermark_width / 2 || 0;
          page_height = (Math.max(parentEle.offsetHeight, parentEle.scrollHeight) - defaultSettings.watermark_height / 2) || 0;

          defaultSettings.watermark_x = defaultSettings.watermark_x + page_offsetLeft;
          defaultSettings.watermark_y = defaultSettings.watermark_y + page_offsetTop;
        }
      }

      // 创建水印外壳div
      let otdiv = document.getElementById(defaultSettings.watermark_id);
      let shadowRoot = null;

      if (!otdiv) {
        otdiv = document.createElement('div');

        // 创建shadow dom
        otdiv.id = defaultSettings.watermark_id;
        otdiv.style.pointerEvents = 'none';

        // 判断浏览器是否支持createShadowRoot方法
        if (typeof otdiv.createShadowRoot === 'function') {
          shadowRoot = otdiv.createShadowRoot();
        } else {
          shadowRoot = otdiv;
        }

        // 将shadow dom随机插入body内的任意位置
        let nodeList = document.body.children;
        let index = Math.floor(Math.random() * (nodeList.length - 1));
        if (nodeList[index]) {
          document.body.insertBefore(otdiv, nodeList[index]);
        } else {
          document.body.appendChild(otdiv);
        }

      } else if (otdiv.shadowRoot) {
        shadowRoot = otdiv.shadowRoot;
      }


      // 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
      if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1), 10) > page_width)) {
        defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + page_offsetLeft) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space), 10);
        defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x + page_offsetLeft - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1), 10);
      }
      // 如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
      if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1), 10) > page_height)) {
        defaultSettings.watermark_rows = parseInt((page_height - defaultSettings.watermark_y + page_offsetTop) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space), 10);
        defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y + page_offsetTop) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1), 10);
      }


      let x;
      let y;
      for (let i = 0; i < defaultSettings.watermark_rows; i++) {
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
        for (let j = 0; j < defaultSettings.watermark_cols; j++) {
          x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

          let mask_div = document.createElement('div');
          let oText = document.createTextNode(defaultSettings.watermark_txt);
          console.log('oText>>', oText);
          // mask_div.appendChild(oText);
          mask_div.innerHTML += `<div><div>${text}</div><div>${Uid}</div><div>${Ip}</div><div>${Mac}</div><div>${Machine}</div><div>${Account}</div><div>${Time}</div></div>`
          // 设置水印相关属性start
          mask_div.id = defaultSettings.watermark_prefix + i + j;
          // 设置水印div倾斜显示
          mask_div.style.webkitTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
          mask_div.style.MozTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
          mask_div.style.msTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
          mask_div.style.OTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
          mask_div.style.transform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)';
          mask_div.style.visibility = '';
          mask_div.style.position = 'absolute';
          // 选不中
          mask_div.style.left = x + 'px';
          mask_div.style.top = y + 'px';
          mask_div.style.overflow = 'hidden';
          mask_div.style.zIndex = '9999';
          // mask_div.style.border="solid #eee 1px";
          mask_div.style.opacity = defaultSettings.watermark_alpha;
          mask_div.style.fontSize = defaultSettings.watermark_fontsize;
          mask_div.style.fontFamily = defaultSettings.watermark_font;
          mask_div.style.color = defaultSettings.watermark_color;
          // mask_div.style.textAlign = 'center';
          mask_div.style.width = defaultSettings.watermark_width + 'px';
          mask_div.style.height = defaultSettings.watermark_height + 'px';
          mask_div.style.display = 'block';
          mask_div.style['-ms-user-select'] = 'none';
          // 设置水印相关属性end
          // 附加到文档中
          shadowRoot.appendChild(mask_div);
        }
      }

    };
    innerLoadMark({watermark_txt: '泉城嘎'});
    return
  }
  var TpLine = parseInt(document.body.clientWidth / W) * 2; // 一行显示几列
  var StrLine = "";
  // for (var i = 0; i < TpLine; i++) {
  StrLine +=
    '<div style="font-family:' +
    fontFamily +
    ";font-size:" +
    fontSize +
    "px;color:" +
    color +
    ";transform:rotate(" +
    fontGradient +
    "deg);opacity:" +
    FontTransparency +
    ';"><div>' +
    text +
    "</div><div>" +
    Uid +
    "</div><div>" +
    Ip +
    "</div><div>" +
    Mac +
    "</div><div>" +
    Machine +
    "</div><div>" +
    Account +
    "</div><div>" +
    Time +
    "</div></div>";
  // }
  var DivLine = document.createElement("div");
  DivLine.innerHTML = StrLine;

  var TpColumn = parseInt(document.body.clientHeight / H) * 2; // 一列显示几行
  var StrColumn = "";
  // for (var i = 0; i < TpColumn; i++) {
  StrColumn +=
    '<div style="white-space: nowrap;">' + DivLine.innerHTML + "</div>";
  // }
  var DivLayer = document.createElement("div");
  DivLayer.innerHTML = StrColumn;
  DivLayer.id = "tp-watermark"; // 给水印盒子添加类名
  // DivLayer.style.top = "0px"; // 整体水印距离顶部距离
  // DivLayer.style.left = "0"; // 改变整体水印的left值
  DivLayer.style.zIndex = "99999"; // 水印页面层级
  DivLayer.style.pointerEvents = "none";
  if (FontMode == 0) {
    console.log("00000000");
  } else if (FontMode == 1) {
    // fontMode == 1  居中状态
    DivLayer.style.position = "absolute";
    DivLayer.style.top = "50%";
    DivLayer.style.right = "50%";
    DivLayer.style.transform = "translate(50%, -50%)";
    console.log("11111111");
  } else if (FontMode == 2) {
    console.log("22222222");
    DivLayer.style.position = "fixed";
    DivLayer.style.top = "0px";
    DivLayer.style.right = "0px";
  } else if (FontMode == 3) {
    console.log("33333333");
    DivLayer.style.position = "fixed";
    DivLayer.style.bottom = "0px";
    DivLayer.style.right = "0px";
  }

  document.body.appendChild(DivLayer); // 到页面中
}

