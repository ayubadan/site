var arr = []
var retailer;
var dict_key={};
var reset_list;

$(function() {
    $('.list-group-item').on('click', async function(event) {        
        retailer = event['target']['text']
        if(!(arr.includes(retailer))){
            $('.list-group a').removeClass('active')
            event.target.className = 'list-group-item list-group-item-action active'  
            arr = []
            arr.push(retailer)
            $('.col-lg-4').remove()
            loadData(event)
        }
    });

    $('.dropdown-item').on('click', function(event) {
        retailer = event['target']['text']
        $('#dropdown_retailers').text(retailer)

        if(!(arr.includes(retailer))){
            arr = []
            arr.push(retailer)
            $('.col-lg-4').remove()
            loadData(event)
        }
    });
    $('#loadmore').on('click', function() {
        loadMore()
    })
    if(arr.length == 0){
        retailer = {'target':{'text':'Footasylum'}} //FUTURE: GET THE RETAILERS FROM THE API  BY QUERYING THE MERCHANT_NAME COLUMN
                                                    //AND RANDOMISE THAT LIST AND INSERT IT IN THE 'RETAILER' DICT. (TO KEEP HOMEPAGE FRESH)
        loadData(retailer)
        arr.push(retailer['target']['text'])
    }
})

function cloneHTML(title,img,price, id, link) {
    var template = document.getElementById("row_template").content;
    var copyHTML = document.importNode(template, true);

    copyHTML.querySelector(".card-title").textContent = title
    copyHTML.querySelector("img").src = img
    copyHTML.querySelector(".price").textContent = '£'+price
    copyHTML.querySelector(".card-text").textContent = id
    copyHTML.querySelector(".card-text").textContent = id
    copyHTML.querySelector("a").href = link

    document.getElementById("row_container").appendChild(copyHTML);
}

function loadData(event){
    retailer_name = event['target']['text'];
    $.ajax({
        url:`https://mu4nuejt68.execute-api.eu-west-1.amazonaws.com/v2/data?retailer=${retailer_name}`,
        type:"GET",
        success: async function(res){
            dict_key["key"] = await res
            console.log(res)
            var list_items = dict_key.key.Items
            for(var i=0;i<list_items.length;i++){
                each_item = list_items[i]
                cloneHTML(each_item.product_name,each_item.aw_image_url, each_item.store_price, each_item.aw_product_id, each_item.aw_deep_link)
            }
            if (res.LastEvaluatedKey == undefined){
                $('#loadmore').hide()
            }
            else{
                $('#loadmore').show()
            }
        },
        error: function(err){
            console.log(err)
        }
    })
} 

function loadMore(){
    key = dict_key.key.LastEvaluatedKey
    retailer =  key.merchant_name 
    id = key.aw_product_id 
    callNextApi(retailer, id)
}

function callNextApi(retailer,id){
    $.ajax({
        url:`https://mu4nuejt68.execute-api.eu-west-1.amazonaws.com/v2/paginate?retailer=${retailer}&id=${id}`,
        type:"GET",
        success: async function(res){
            dict_key["key"] = await res
            console.log(dict_key)
            var list_items = dict_key.key.Items
            for(var i=0;i<list_items.length;i++){
                each_item = list_items[i]
                cloneHTML(each_item.product_name,each_item.aw_image_url, each_item.store_price)
            }
            if (res.LastEvaluatedKey == undefined){
                $('#loadmore').hide()
            }
            else{
                $('#loadmore').show()
            }
        },
        error: function(err){
            console.log(err)
        },
    })
}
