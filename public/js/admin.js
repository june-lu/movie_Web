$(function () {//这是jQuery的内置函数，表示网页加载进来时要执行的意思;相当于js中的window.onload()函数
    $('.del').click(function (e) {
        var target = $(e.target);//拿到当前点击到的的按钮
        var id = target.data("id");
        var tr = $('.item-id-' + id);
        console.log(id);
        $.ajax({
            type:"DELETE",
            url:"/admin/list?id=" + id
        })
        .done(function (results) {
            if(results.success === 1){
                if(tr.length>0) {
                    tr.remove();
                }
            }
        })
    })
})