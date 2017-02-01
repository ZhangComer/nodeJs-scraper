    var fs = require('fs');  
    var cheerio = require('cheerio');
    var request = require('request');
    var superagent = require('superagent'); 


    var topten = [{ author : '', date : '',year:'', oo : 0, xx: 0 , url:''}];
    var page = 2300;
    var bcontinue = true;

    getSeeds = function(url){
        superagent.get('http://i.jandan.net/ooxx/page-'+url)    
          .end(function(err,docs){
            page-- 
            if(!err){
                console.log(page)
                var $ = cheerio.load(docs.text)  
                $('.commentlist li').each(function(){
                    var json = { author:'', year:'', date:'', oo:0, xx:0, url:''};
                    var data = $(this);
        	        json.date = data.children().eq(1).text()
        	        json.year = json.date.substring(2, 6)
               
                    if(json.year == '2016'){
                        json.oo = parseInt(data.find("*[id*='cos_support']").text())
                        json.author = data.children().first().text()
                        json.xx = parseInt(data.find("*[id*='cos_unsupport']").text())
                        json.url = data.find('.commenttext p img').attr('src')

                        var lastone = topten[topten.length-1]
                        if(lastone.oo < json.oo){
                            topten.push(json)
                            topten.sort(function(a, b) { return b.oo - a.oo });
                            if(topten.length>20){
                                topten.pop()
                            }
                        }
                    }

                    if(json.year == '2015'){
                        bcontinue = false
                    } 
                })
            }

            if (bcontinue){
                getSeeds(page)
            }else{
                console.log(topten)
                for(var j=0;j<topten.length;j++){
                    var downs = topten[j]
                    if(downs.oo>100)
                        downloadImg('http:'+downs.url,downs.url.split('/')[4]);
                }
            }
        })
    };

    var dir = './images';
    var downloadImg = function(url, filename){
     request.head(url, function(err, res, body){
       request(url).pipe(fs.createWriteStream(dir + "/" + filename));
     });
    };

    getSeeds(page)



 

