let deleteModal = '';
let productModal = '';
const app = {
    data(){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'immigrant524',
            products: [],
            temp: '',
        }
    },
    methods:{
        getProducts(){ // 取資料
            axios.get(`${this.url}/api/${this.path}/admin/products`)
            .then(res=>{
                // console.log(res.data.products);
                this.products = [...res.data.products,];
                
            })
            .catch(rej=>{
                console.dir(rej)
            })
        },
        Authorization(){
            //取出 token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token; // 認證

            axios.post(`${this.url}/api/user/check`) // 檢查有無過期，沒成功回 login 頁面
            .then(res=>{
                this.getProducts(); // 認證成功取資料
            })
            .catch(err=>{
                window.location='login.html';
            })

        },
        openModal(Modal,DataStatus,item){ // 開啟產品 Modal
            
            this.temp= JSON.parse(JSON.stringify(item));
            this.temp.status= DataStatus ;  // 將資料狀態寫入
            if(Modal=='productMoal'){
                      // 將資料另外放入 temp
                if(!this.temp.imagesUrl){
                    this.temp.imagesUrl= [];
                }
                
                productModal.show();
            }
            else if(Modal=="deleteModal"){
              
                deleteModal.show();
            }
            
        },
        createOrEditData(temp){  // 建立或編輯新資料
            let method= 'post';     // 預設方法為新增
            let method_url = `${this.url}/api/${this.path}/admin/product`;  // 新增的url

            if(temp.status== "exist"){   // 判斷是編輯資料
                const id = temp.id;      // 取出資料id
                 method= 'put';         // 將方法修改成編輯api的put
                 method_url = `${this.url}/api/${this.path}/admin/product/${id}`;  // 編輯的 url
            }
          
            axios[method](`${method_url}`,{data: temp})  // 依照新增或編輯帶入相對應 方法與url
            .then(res=>{
                this.getProducts();   // 更新畫面
            })
            .catch(rej=>{
               
                alert(rej)
            })
            productModal.hide();
        },
        closeModal(ModalStatus){  // 關閉視窗，判斷是 商品視窗或刪除視窗
            console.log(ModalStatus);
            if(ModalStatus=="closeProductModal"){
                this.temp= '',
                productModal.hide();
            }
            else if(ModalStatus=="closeDeleteModal"){
                this.temp= '',
                deleteModal.hide();
            }
           
        },
        deleteData(temp){   // 刪除資料 api
            const id = temp.id;
           
            axios.delete(`${this.url}/api/${this.path}/admin/product/${id}`)
            .then(res=>{
                // console.log(res);
                deleteModal.hide();
                this.getProducts();
            })
            .catch(rej=>{
             
                deleteModal.hide();
            })
        },
       

    },
    mounted(){
        this.Authorization();
        deleteModal =  new bootstrap.Modal(document.querySelector('#delProductModal'));
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    }
    
}
Vue.createApp(app).mount('#app')
