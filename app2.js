    var fs = require('fs');  
    var cheerio = require('cheerio');
    var request = require('request');
    var superagent = require('superagent'); 
    var async = require('async');

    
    
    var topten = [{ author:'', year:'', date:'', oo:0, xx:0, url:''}];
    getSeeds = function(url,callback){
        superagent.get('http://i.jandan.net/ooxx/page-'+url)    
          .end(function(err,docs){ 
            console.log(url)
            var year = '2016';
            if(!err){
                var $ = cheerio.load(docs.text)  
                $('.commentlist li').each(function(){
                    var json = { author:'', year:'', date:'', oo:0, xx:0, url:''};
                    var data = $(this);
        	        json.date = data.children().eq(1).text()
        	        json.year = json.date.substring(2, 6)
                    year = json.year
                    if(json.year == '2016'){
                        json.author = data.children().first().text()
                        json.oo = parseInt(data.find("*[id*='cos_support']").text())
                        json.xx = parseInt(data.find("*[id*='cos_unsupport']").text())
                        json.url = data.find('.commenttext p img').attr('src')

                        var lastone = topten[topten.length-1]
                        if(lastone.oo < json.oo){
                            topten.push(json)
                            topten.sort(function(a, b) { return b.oo - a.oo });
                            if(topten.length>10){
                                topten.pop()
                            }
                        }
                       
                    }
                    
                })
            }
            if(year =='2015')
                callback(true)
            else
                callback()

        })
    };

    var pages = [];
    for(var i=2300;i>1300;i--){
        pages.push(i);
    }

    async.mapLimit(pages, 40,
        function (page, cb) {
            getSeeds(page, cb);
        }, 
        function (err, results) {
            setTimeout(function () { //等一会儿，其他的页面都callback
                console.log(topten)
            }, 3000);
        }
    );
    
    // async.whilst(
    //     function() { 
    //         pages = [];
    //         for(var i=0; i<40; i++){
    //             pages.push(firstpage-i)
    //         }
    //         firstpage = firstpage-40
    //         return year != 2015
    //     },

    //     function(callback) {
            
    //         async.map(pages, 
    //             function (page, cb) {
    //                 getSeeds(page, cb);
    //             }, 
    //             function (err, results) {
    //                 callback(err,results)
    //             }
    //         );
            
    //     },
    //     function (err, n) {
 
    //     }
    // );






                      
    



 

