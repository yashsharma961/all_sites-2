

let config_f = {
    "prod": [
  
      {
          //similar //also bought
          "classSelector": [".cp-product"],
  
            "nameSelector": [
              { "selector": [".product-img.mini-cart-image","img"], attribute:"title"},
              {selector:['.product-img','img'], attribute:'alt'},
              {selector:['.product-title']}
            ],
            "imgSelector": [
                { "selector": [".product-img.mini-cart-image", "img"], "attribute": "src" },
                {"selector":['.product-img.plp-card-thumbnail','img'], attribute:'src'},
                {'selector':['.product-img','img'], attribute:'src'}
            ],
  
            "priceSelector": [
              {selector:['.cp-price','.amount'],"regex": [/\d+(\.\d+)?/g] },
                { "selector": ["#pdp-product-price"], "regex": [/\d+(\.\d+)?/g] },
                {selector:['.mobile-cart-price-grid','span'], "regex": [/\d+(\.\d+)?/g]}
            ],
            mrpSelector:[
              {selector:['.old-price','.amount'],"regex": [/\d+(\.\d+)?/g] }
            ],
  
          
  
            "pidSelector": [
                { "selector": ["a"], "attribute": "href", "regex": [/\/p\/(\d+)/] }
            ],
  
            "availSelector": {
                "avail":['.not-available-text'] ,"keyword2":""
            },
  
        },
  
        {
          //product page
            "classSelector": ["html"],
  
            "nameSelector": [
                { "selector": [".pd-title.pd-title-normal"] },
            ],
            "imgSelector": [
                { "selector": [".swiper-slide.swiper-slide-active", "img"], "attribute": "src" }
            ],
  
            "priceSelector": [
                { "selector": ["#pdp-product-price"], "regex": [/\d+(\.\d+)?/g] }
            ],
  
            "mrpSelector": [
                { "selector": ["#old-price"], "regex": [/\d+(\.\d+)?/g] },
            ],
  
            "pidSelector": [
                { "selector": ["link[rel='canonical']"], "attribute": "href", "regex": [/\/p\/(\d+)$/] }
            ],
  
            "availSelector": {
                "avail": [".title.delivery-not-available"]
            },
  
            "breadSelector": [
                { "selector": [".cp-breadcrumb"], "bread": "li", "selectingbread": [], trim: 1}
            ]
        
        }
        
    ]
  
  }
  
  
function name_correction(name) {
    let correctedName = name.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    return correctedName;
  }
  
  function getProductName(div, config) {
    try {
      let data = config.nameSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div,
            sel2 = div;
          let val = "",
            brand = "";
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++) {
            sel1 = sel1.querySelector(obj.selector[j]);
          }
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1[obj.attribute];
          } else {
            //change 26/7
            let tem = sel1.textContent;
            if (tem == null || tem == "" || obj.selector.length == 0) {
              val = sel1;
            } else {
              val = tem;
            }
          }
  
          if (obj.hasOwnProperty("slice")) {
            start = obj.slice[0];
            if (obj.slice.length > 1) {
              end = obj.slice[1];
            } else {
              end = val.length;
            }
            val = val.slice(start, end);
          }
          //change 26/7
          if (obj.hasOwnProperty("path")) {
            val = accessPath(val, obj.path);
          }
  
          if (obj.hasOwnProperty("brandselector")) {
            for (let j = 0; j < obj.brandselector.length; j++) {
              if (sel2 == null) {
                break;
              }
              sel2 = sel2.querySelector(obj.brandselector[j]);
            }
  
            if (sel2 != null && obj.hasOwnProperty("brandattribute")) {
              brand = sel2[obj.brandattribute];
            } else {
              if (sel2 != null) {
                brand = sel2.textContent;
              }
            }

  
            if (brand != "" && brand != null) {
              val = brand.trim() + " " + val.trim();
            }
          }
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j])[1];
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
          if (val != "" && val != null) {
            val = val.replaceAll("&amp;", "&");
            val = val.replaceAll("\n", "");
            val = val.replaceAll("❯", "");
            return val.trim();
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function make_correction(str) {
    let start;
    let last;
    for (let i = 0; i < str.length; i++) {
      if (str[i] == "{") {
        start = i;
        break;
      }
    }
    let dep = 0;
    for (let i = start; i < str.length; i++) {
      if (str[i] == "{") dep = dep + 1;
      else if (str[i] == "}") dep = dep - 1;
      if (dep == 0) {
        last = i;
        break;
      }
    }
    return str.substring(start, last + 1);
  }
  
  function accessPath(jsonObject, path) {
    try {
      const pathComponents = path.split(".");
      let current = jsonObject;
  
      for (const component of pathComponents) {
        if (component.includes("[") && component.includes("]")) {
          const propName = component.substring(0, component.indexOf("["));
          const index = parseInt(component.match(/\d+/)[0], 10);
          if (Array.isArray(current[propName])) {
            current = current[propName][index];
          } else {
            throw new Error(`Invalid path: ${path}`);
          }
        } else {
          current = current[component];
        }
      }
  
      return current;
    } catch (error) {
     // console.log(error);
      return null; // or some default value indicating failure
    }
  }
  
  function getSku(div, config) {
    try {
      let data = config.skuSelector1;
  
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = "";
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1.getAttribute(obj.attribute);
          } else {
            let tem = sel1.textContent;
            if (tem == null || tem == "") {
              val = sel1;
            } else {
              val = tem;
            }
          }
  
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j])[1];
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
  
          if (val != "" && val != null) return val.trim();
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }

  function getPID(div, config) {
    try {
      let data = config.pidSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = "";
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++) {
            sel1 = sel1.querySelector(obj.selector[j]);
          }
          if (obj.hasOwnProperty("attribute")) {
            val = sel1[obj.attribute];
          } else {
            let tem = sel1.textContent;
            if (tem == null || tem == "" || obj.selector.length == 0) {
              val = sel1;
            } else {
              val = tem;
            }
          }
         
          if(obj.hasOwnProperty('url'))
          val = window.location.href
  
          if (obj.hasOwnProperty("path")) {
            val = accessPath(val, obj.path);
          }
          let sv=0,pk=0;
          if(obj.hasOwnProperty('navKey')){
                if(!val.includes('navKey')){return "";}
                if(val.includes("/sv/")){sv=1;}
                if(val.includes("/pk/")){pk=1;}
          }
    
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j])[1];
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
          // console.log(val)
          if(sv){
  
          val=val+"~sv"
        }
        if(pk){
         val=val+"~pk"
        }
          if (val != "" && val != null) {
            if (config.hasOwnProperty("skuSelector1")) {
                let suffix = getSku(div, config);
                val = val + "~" + suffix;
              }
            return val.trim();
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function getskuSelector(div, config) {
    try {
      let pid = getPID(div, config);
      if(config.hasOwnProperty('skuSelector')){
            let data = config.skuSelector;
            for (let i = 0; i < data.length; i++) {
              try {
                let sel1 = div;
                let val = "";
                obj = data[i];
                for (let j = 0; j < obj.selector.length; j++) {
                  sel1 = sel1.querySelector(obj.selector[j]);
                }

                if (obj.hasOwnProperty("attribute")) {
                  val = sel1[obj.attribute];
                } else {
                  let tem = sel1.textContent;
                  if (tem == null || tem == "" || obj.selector.length == 0) {
                    val = sel1;
                  } else {
                    val = tem;
                  }
                }

                if(obj.hasOwnProperty('url'))
                val = window.location.href

                if (val != "" && val!= null) {
                    val = val.trim();
                  
                }
                if (obj.hasOwnProperty("regex")) {
                  for (let j = 0; j < obj.regex.length; j++) {
                      let tem = val.match(obj.regex[j])[1];
                      if (tem != null && tem != "") {
                        val = tem;
                        break;
                      }
                    } 
                  }
                  val=val.trim();
                 let final_pid=pid+"~"+val;
                 final_pid=final_pid.trim();
                  if (val != "Onesize") {
                    return final_pid;
                  } else {
                    return pid;
                  }
                
              } catch (err) {
                // do nothing
              }
            }
      }
      return pid;
    } catch (error) {
      return "";
    }
  }
  //change 26/7

  function getVProductName(div, config, vid_class) {
    try {
      let data = config.nameSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = document;
          let val = "",
            obj = data[i];
  
          for (let j = 0; j < obj.selector.length; j++) {
            if (j == 0) {
              sel1 = sel1.querySelector("." + vid_class + obj.selector[j]);
            } else sel1 = sel1.querySelector(obj.selector[j]);
          }
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1[obj.attribute];
          } else {
            val = sel1.textContent;
          }
  
          if (val != "" && val != null) {
            return val.trim();
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function getVProductImage(div, config, vid_class) {
    try {
      let data = config.imgSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = document;
          let val = "",
            obj = data[i];
  
          for (let j = 0; j < obj.selector.length; j++) {
            if (j == 0) {
              sel1 = sel1.querySelector("." + vid_class + obj.selector[j]);
            } else sel1 = sel1.querySelector(obj.selector[j]);
          }
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1.getAttribute(obj.attribute);
          } else {
            val = sel1.textContent;
          }
  
          if (
            obj.hasOwnProperty("replace") &&
            obj.hasOwnProperty("replace_with")
          ) {
            for (let t = 0; t < obj.replace.length; t++) {
              let temp = val.replace(obj.replace[t], obj.replace_with);
              val = temp;
            }
          }
  
          if (val != "" && val != null) {
            return val.trim();
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function getProductImg(div, config) {
    try {
      let data = config.imgSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = "";
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1[obj.attribute];
          } else {
            val = sel1.textContent;
          }
  
          if (obj.hasOwnProperty("path")) {
            val = accessPath(val, obj.path);
          }
  
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let ind = 1;
                if (obj.hasOwnProperty("match")) {
                  ind = obj.match;
                }
                let tem = val.match(obj.regex[j])[ind];
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
  
          //change 26/7
          if (
            obj.hasOwnProperty("replace") &&
            obj.hasOwnProperty("replace_with")
          ) {
            for (let t = 0; t < obj.replace.length; t++) {
              let temp = val.replace(obj.replace[t], obj.replace_with);
              val = temp;
            }
          }
  
          if (val != "" && val != null) {
            return val.trim();
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function getPrice(div, config) {
    try {
      let data = config.priceSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = null;
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++) {
            sel1 = sel1.querySelector(obj.selector[j]);
          }
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1[obj.attribute];
          } else {
            val = sel1.textContent;
          }
  
          if (obj.hasOwnProperty("path")) {
            val = accessPath(val, obj.path);
          }
  
          //change 26/7
          if (obj.hasOwnProperty("sub_reg")) {
            val = val.match(obj.sub_reg)[0];
          }
  
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j]).join("");
                tem = parseFloat(tem);
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
  
          val = parseFloat(val);
  
          if (val != "" && val != null && !isNaN(val)) return val;
        } catch (err) {
          // do nothing
        }
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }
  
  function getMRP(div, config) {
    try {
      let data = config.mrpSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          if (data[i] == "no mrp") return 0;
          let sel1 = div;
          let val = null;
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          if (obj.hasOwnProperty("attribute")) val = sel1[obj.attribute];
          else val = sel1.textContent;
          if (obj.hasOwnProperty("path")) val = accessPath(val, obj.path);
  
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j]).join("");
                tem = parseFloat(tem);
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
  
          val = parseFloat(val);
  
          if (val != "" && val != null && !isNaN(val)) return val;
        } catch (err) {
          // do nothing
        }
      }
      return getBestPrice(div, config);
    } catch (error) {
      return 0;
    }
  }
  

  function getPrice_myntra(div, config) {
    try {
      let data = config.extraPriceSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = null;
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1[obj.attribute];
          } else val = sel1.textContent;
  
          if (obj.hasOwnProperty("path")) val = accessPath(val, obj.path);
  
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j]).join("");
                tem = parseFloat(tem);
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
          if (val != "" && val != null) return val;
        } catch (err) {
          // do nothing
        }
      }
      return getPrice();
    } catch (error) {
      return null;
    }
  }
  
  function getBread(div, config) {
    //count of how many items from last to be removed
    try {
      let data = config.breadSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = "";
          obj = data[i];
  
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          let reduce = 0;
  
          if (obj.hasOwnProperty("trim")) reduce = obj.trim;
  
          for (
            let j = 0;
            j < sel1.querySelectorAll(obj.bread).length - reduce;
            j++
          ) {
            let bread = sel1.querySelectorAll(obj.bread)[j];
  
            for (let k = 0; k < obj.selectingbread.length; k++)
              bread = bread.querySelector(obj.selectingbread[k]);
  
            if (obj.hasOwnProperty("attribute")) bread = bread[obj.attribute];
            else bread = bread.textContent;
  
            bread = bread.trim();
            val = val + "~" + bread;
          }
          val = val.trim();
          val = val.replaceAll("&amp;", "&");
          val = val.replaceAll("\n", "");
          val = val.replaceAll("❯", "");
          if (val != "") {
            val = val.slice(1);
            return val;
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function getBestPrice(div, config) {
    let price = getPrice(div, config);
    if (price == 0) {
      return price;
    }
    
    if (!config.hasOwnProperty("bestpriceSelector")) {
      return price;
    }

    let data = config.bestpriceSelector;
    let otherPrices = [];
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      let sel = document.querySelectorAll(obj.selector);
      for (let k = 0; k < sel.length; k++) {
        var this_price = sel[k].querySelector(obj.othersellerprice).textContent;
        if (obj.hasOwnProperty("regex")) {
          for (let j = 0; j < obj.regex.length; j++) {
            let temp = this_price.match(obj.regex[j]).join("");
            temp = parseFloat(temp);
            if (temp != null && temp != "") {
              this_price = temp;
              break;
            }
          }
        }
  
        this_price = parseFloat(this_price);
        if (this_price != "" && this_price != null && !isNaN(this_price)) {
          otherPrices.push(this_price);
        }
      }
    }
  
    for (let it of otherPrices) {
      if (it < price) {
        price = it;
      }
    }
    return price;
  }
  
  //change 26/7
  function isAlphanumeric(str) { 
    return /^[~\/a-zA-Z0-9- _.]+$/.test(str);
  }
  
  function getVProductName(div, config, vid_class) {
    try {
      let data = config.nameSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = document;
          let val = "",
            obj = data[i];
  
          for (let j = 0; j < obj.selector.length; j++) {
            if (j == 0) {
              sel1 = sel1.querySelector("." + vid_class + obj.selector[j]);
            } else sel1 = sel1.querySelector(obj.selector[j]);
          }
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1[obj.attribute];
          } else {
            val = sel1.textContent;
          }
  
          if (val != "" && val != null) {
            return val.trim();
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function getVProductImage(div, config, vid_class) {
    try {
      let data = config.imgSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = document;
          let val = "",
            obj = data[i];
  
          for (let j = 0; j < obj.selector.length; j++) {
            if (j == 0) {
              sel1 = sel1.querySelector("." + vid_class + obj.selector[j]);
            } else sel1 = sel1.querySelector(obj.selector[j]);
          }
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1.getAttribute(obj.attribute);
          } else {
            val = sel1.textContent;
          }
  
          if (
            obj.hasOwnProperty("replace") &&
            obj.hasOwnProperty("replace_with")
          ) {
            for (let t = 0; t < obj.replace.length; t++) {
              let temp = val.replace(obj.replace[t], obj.replace_with);
              val = temp;
            }
          }
  
          if (val != "" && val != null) {
            return val.trim();
          }
        } catch (err) {
          // do nothing
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  }
  
  function getVid(div, config) {
    try {
      let data = config.idSelector;
  
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = "";
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          if (obj.hasOwnProperty("attribute")) {
            val = sel1.getAttribute(obj.attribute);
          } else {
            let tem = sel1.textContent;
            if (tem == null || tem == "") {
              val = sel1;
            } else {
              val = tem;
            }
          }
  
          if (obj.hasOwnProperty("prepend")) {
            val = obj.prepend + val;
          }
          if (val != "" && val != null) return val.trim();
        } catch (err) {
          // do nothing
          //console.log(err)
        }
      }
      return "";
    } catch (error) {
      //console.log(error)
      return "";
    }
  }
  
  function getVPrice(div, config) {
    try {
      let data = config.priceSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          let sel1 = div;
          let val = null;
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          if (obj.hasOwnProperty("attribute"))
            val = sel1.getAttribute(obj.attribute);
          else val = sel1.textContent;
  
          if (obj.hasOwnProperty("path")) val = accessPath(val, obj.path);
  
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j]).join("");
                tem = parseFloat(tem);
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
  
          val = parseFloat(val);
  
          if (val != "" && val != null && !isNaN(val)) return val;
        } catch (err) {
          // do nothing
        }
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }
  
  function getVMRP(div, config) {
    try {
      let data = config.mrpSelector;
      for (let i = 0; i < data.length; i++) {
        try {
          if (data[i] == "no mrp") return 0;
          let sel1 = div;
          let val = null;
          obj = data[i];
          for (let j = 0; j < obj.selector.length; j++)
            sel1 = sel1.querySelector(obj.selector[j]);
  
          if (obj.hasOwnProperty("attribute"))
            val = sel1.getAttribute(obj.attribute);
          else val = sel1.textContent;
  
          if (obj.hasOwnProperty("path")) val = accessPath(val, obj.path);
  
          if (obj.hasOwnProperty("regex")) {
            for (let j = 0; j < obj.regex.length; j++) {
              try {
                let tem = val.match(obj.regex[j]).join("");
                tem = parseFloat(tem);
                if (tem != null && tem != "") {
                  val = tem;
                  break;
                }
              } catch (err) {
                // do nothing
              }
            }
          }
  
          val = parseFloat(val);
  
          if (val != "" && val != null && !isNaN(val)) return val;
        } catch (err) {
          // do nothing
        }
      }
      return getVPrice(div, config);
    } catch (error) {
      return 0;
    }
  }
  
  function getVariant(div, config) {
    try {
      let arr = [];
      let def = {
        name: getProductName(div, config),
        img_url: getProductImg(div, config),
        mrp: getMRP(div, config),
        pid: getPID(div, config),
        avail: getAvailability(div, config),
        breadcrumbs: getBread(div, config),
        price: getBestPrice(div, config),
      };
      let data = config.VclassSelector;
      data = document.querySelectorAll(data);
      for (let i = 0; i < data.length; i++) {
        let obj = data[i]; //we need to check if there is another loop
        let res = {};
  
        if (def.mrp != 0) res.mrp = def.mrp;
        else res.mrp = getVMRP(obj, config.variant);
  
        if (def.pid != "") res.pid = def.pid;
        else res.pid = getPID(obj, config.variant);
  
        if (def.avail != 2) res.avail = def.avail;
        else res.avail = getAvailability(obj, config.variant);
  
        if (def.breadcrumbs != "") res.breadcrumbs = def.breadcrumbs;
        else res.breadcrumbs = getBread(obj, config.variant);
  
        if (def.price != 0) res.price = def.price;
        else res.price = getVPrice(obj, config.variant);
  
        let sku = getSku(obj, config.variant);
        if (res.pid != "") res.pid = res.pid + "~" + sku.toString();
  
        let vid_class = getVid(obj, config.variant);
  
        if (def.name != "") res.name = def.name;
        else res.name = getVProductName(obj, config.variant, vid_class);
  
        if (def.img_url != "") res.img_url = def.img_url;
        else res.img_url = getVProductImage(obj, config.variant, vid_class);
  
        if (res.pid != "") {
          if (isAlphanumeric(res.pid)) arr.push(res);
       }
      }
  
      return arr;
    } catch (err) {
      return [];
    }
  }
  
  function sGetName(root, targeti, sel) {
    try {
      let name = "";
      let brand = "";
      let obj = sel.nameSelector;
      if (obj.selector == "globalpath") {
        name = accessPath(root, sel.globalpath.nameselector);
      } else {
        name = accessPath(targeti, obj.selector);
      }
      if (obj.hasOwnProperty("brandselector")) {
        if (obj.brandselector == "globalpath") {
          brand = accessPath(root, sel.globalpath.brandselector);
        } else {
          brand = accessPath(targeti, obj.brandselector);
        }
      }
      if (brand == null) brand = "";
  
      if (name == null) name = "";
  
      brand = brand.trim();
      name = name.trim();
      brand = brand + " " + name;
      brand = brand.trim();
  
      return brand;
    } catch (err) {
      return "";
    }
  }
  
  function sGetPid(root, targeti, sel) {
    let pid = "";
    let vid = "";
    let obj = sel.pidSelector;
    if (obj.selector == "globalpath") {
      pid = accessPath(root, sel.globalpath.pidselector);
    } else {
      pid = accessPath(targeti, obj.selector);
    }
    if (obj.vselector == "globalpath") {
      vid = accessPath(root, sel.globalpath.vselector);
    } else {
      vid = accessPath(targeti, obj.vselector);
    }
  
    if ((vid == "" || vid == null) && (pid == "" || pid == null)) {
      return "";
    } else if ((vid == "" || vid == null) && pid != "" && pid != null) {
      return pid;
    } else {
      return pid + "~" + vid;
    }
  }
  
  function sGetPrice(root, targeti, sel) {
    let oos=sGetAvailability(root,targeti,sel);
    if(oos==0){return 0;}
    let price = "";
  
    let obj = sel.priceSelector;
    if (obj.selector == "globalpath") {
      price = accessPath(root, sel.globalpath.priceselector);
    } else {
      price = accessPath(targeti, obj.selector);
    }
  
    return price;
  }
  
  function sGetMrp(root, targeti, sel) {
    let mrp = "";
  
    let obj = sel.mrpSelector;
    if (obj.selector == "globalpath") {
      mrp = accessPath(root, sel.globalpath.mrpselector);
    } else {
      mrp = accessPath(targeti, obj.selector);
    }
  
    return mrp;
  }
  
  function sGetImage(root, targeti, sel) {
    let image = "";
  
    let obj = sel.imgSelector;
    if (obj.selector == "globalpath") {
      image = accessPath(root, sel.globalpath.imgselector);
    } else {
      image = accessPath(targeti, obj.selector);
    }
  
    return image;
  }
  
  function sGetAvailability(root, targeti, sel) {
    let oos = false;
  
    let obj = sel.availSelector;
    if (obj.selector == "globalpath") {
      oos = accessPath(root, sel.globalpath.availselector);
    } else {
      oos = accessPath(targeti, obj.avail);
    }
  
    //console.log(oos);
    if (oos) {
      return 1;
    }
    return 0;
  }
  

  function getAvailability(div, config) {
    // not deliverable functionalit
    let data = config.availSelector;
    if(data && data.keyword2){
             let txt=div.querySelector(data.avail[0]).textContent;
             if(txt=="Not Available at pincode"){return 2;}//croma
             else{
                  return 1;
             }
         
    }
    else
    if (data && data.avail) {
      if (Array.isArray(data.avail)) {
        for (let i = 0; i < data.avail.length; i++) {
          if (div.querySelector(data.avail[i])) {
              if(data.hasOwnProperty('shouldContain')){
                  if(div.querySelector(data.avail[i]).textContent.includes(data.shouldContain))
                  return 0;
                  else
                  return 1;
                }
              else
              if (div.querySelector(data.avail[i]).textContent.includes("deliv") || div.querySelector(data.avail[i]).textContent.includes("pincode") )
              return 2;
              else 
              return 0;
          }
        }
        return 1;
      } else {
        return data.avail;
      }
    }
    else
    if(data && data.contains)
    {
      if(div.classList.contains(data.contains))
      return 0
      else
      return 1
    } else return 2;
  }
  function scriptExtractor(config) {
    try {
      let arr = [];
      let all_scripts = document.querySelectorAll("script");
      let need_script = null;
      for (sc of all_scripts) {
        if (sc.textContent.includes(config.scriptSelector)) {
          need_script = sc;
          break;
        }
      }
      if (need_script == null) {
        console.log("cant find need_script");
        return arr;
      }
      let need_script_string = need_script.textContent;
      need_script_string = make_correction(need_script_string);
      let root = JSON.parse(need_script_string);
      let target = accessPath(root, config.targetpath);
      for (let i = 0; i < target.length; i++) {
        let res = {
          name: sGetName(root, target[i], config),
          pid: sGetPid(root, target[i], config),
          price: sGetPrice(root, target[i], config),
          mrp: sGetMrp(root, target[i], config),
          avail: sGetAvailability(root, target[i], config),
          img_url: sGetImage(root, target[i], config),
          breadcrumbs: getBread(document,config)
        };
        if (res.pid != "") {
            if (isAlphanumeric(res.pid)){ 
            arr.push(res);}
            }
      }
      return arr;
    } catch (err) {
      return [];
    }
  }
  
  function extractor() {
    try {
      let arr = [];
      for (let it of config_f.prod) {
        if (it.hasOwnProperty("scriptSelector")) {
          arr.push(...scriptExtractor(it));
          continue;
        }
        let data = it.classSelector;
        let doc = document;
        if(it.hasOwnProperty('iframeClass'))
        {
            if(document.querySelector(it.iframeClass))
            {
                doc = document.querySelector(it.iframeClass).contentWindow.document
            }
            else
            {
                continue;
            }
        }
        data = doc.querySelectorAll(data);
        for (let i = 0; i < data.length; i++) {
          let obj = data[i]; //we need to check if there is another loop
          if (it.hasOwnProperty("VclassSelector")) {
            arr.push(...getVariant(obj, it));
            continue;
          }
  
          let flag = 0;
          if (it.extraPriceSelector) {
            flag = 1;
          }
          let res = {
            name: getProductName(obj, it),
            img_url: getProductImg(obj, it),
            mrp: getMRP(obj, it),
            pid: getskuSelector(obj, it),
            avail: getAvailability(obj, it),
            breadcrumbs: getBread(obj, it),
            price: flag == 0 ? getBestPrice(obj, it) : getPrice_myntra(obj, it),
          }
          if (res["price"] == 0) {
            res["price"] = getBestPrice(obj, it);
          }
        if (res.pid != "") {
         if (isAlphanumeric(res.pid)){ 

            arr.push(res);
          }
         }
        }
      }
  
      return arr;
    } catch (err) {
      return [];
    }
  }
  
  setInterval(function () {
    // extractor()
    let p = extractor();
    console.log(p);
  }, 5000);