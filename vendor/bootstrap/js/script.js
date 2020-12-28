
$(function() {
    $('.dropdown-item').on('click', async function(event) {
        var retailer_name = await event['target']['text'];
        $.ajax({
            url:`https://zeyasvsme6.execute-api.eu-west-1.amazonaws.com/v2/data?retailer=${retailer_name}`,
            type:"GET",
            dataType: "json",
            success: function(res){
                console.log(res.Items.length)
            },
            error: function(err){
                console.log(err)
            }
        })
    });

})
