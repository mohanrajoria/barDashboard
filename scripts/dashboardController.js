barApp.controller('dashboardController', function($route, $scope, $rootScope) {
    $scope.categories = [];
    $scope.newSubCategoryObject = {};
    $scope.newCategoryObject = {};
    $scope.newSubCategory = {
        name : "",
        minPrice : '',
        maxPrice : '',
        quantity : '',
        mixer : false
    }
    $scope.subCategoriesHash = {};
    $scope.categoriesHash = {};
    $scope.newCategoryAtTheEnd = {
        name : '',
        state : 'insert'
    }

    $scope.formatCategories = function(response) {
        if(!response || !response.data) {
            return;
        }
        var data = response.data;
        var categories = data.stockCategoryList;
        var subCategories = data.stockSubCategoryList;

        categories.forEach(function(c, i) {
            c['state'] = '';
            $scope.categoriesHash[c.id] = c;
            $scope.categories.push(c.id);
            $scope.newSubCategoryObject[c.id + '_new'] = {
                name : '',
                minPrice : '',
                maxPrice : '',
                quantity : '',
                mixer : false
            }
            $scope.newCategoryObject[c.id + '_new'] = {
                name : '',
                state : 'insert'
            }
        })

        subCategories.forEach(function(sc, j) {
            $scope.subCategoriesHash[sc.id] = sc;
        })
    }

    var generateGUID = function(){
        var hiddenStr = 'xxxxxxxx4xxxyxxx';
        var hidnGUID = hiddenStr;
        var uid = hidnGUID.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = (c == 'x') ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        return uid;
    }

    $scope.addSubCategory = function(categoryId) {
        console.log(categoryId);
        var newSubCatObj = {
            name : $scope.newSubCategoryObject[categoryId+'_new'].name || "",
            min_price : $scope.newSubCategoryObject[categoryId+'_new'].minPrice || 0,
            max_price : $scope.newSubCategoryObject[categoryId+'_new'].maxPrice || 0,
            quantity : $scope.newSubCategoryObject[categoryId+'_new'].quantity || 0,
            mixer_available : $scope.newSubCategoryObject[categoryId+'_new'].mixer,
            high : $scope.newSubCategoryObject[categoryId+'_new'].maxPrice || 0,
            low : $scope.newSubCategoryObject[categoryId+'_new'].minPrice || 0,
            state : 'inserted'
        }

        if(newSubCatObj.name) {
            var newGUID = generateGUID();
            newSubCatObj['id'] = newGUID;
            $scope.subCategoriesHash[newGUID] = newSubCatObj;
            $scope.categoriesHash[categoryId]['sub_category_ids'].push(newGUID);
            clearNewSubCatObj(categoryId);
        }
    }

    var clearNewSubCatObj = function(categoryId) {
        $scope.newSubCategoryObject[categoryId+'_new']['name'] = "";
        $scope.newSubCategoryObject[categoryId+'_new']['minPrice'] =  '';
        $scope.newSubCategoryObject[categoryId+'_new']['maxPrice'] = '';
        $scope.newSubCategoryObject[categoryId+'_new']['quantity'] = '';
        $scope.newSubCategoryObject[categoryId+'_new']['mixer'] = false;
    }

    $scope.subCategoryModified = function(categoryId, subCategoryId) {
        // todo : mark as modified
        $scope.subCategoriesHash[subCategoryId]['state'] = 'modified';
    }

    $scope.deleteSubCategory = function(categoryId, subCategoryId) {
        // todo : mark as deleted
        var result = confirm( "Are you sure baby?" );
        if (result) {
            $scope.subCategoriesHash[subCategoryId]['state'] = 'deleted';
            var subCatIndex = $scope.categoriesHash[categoryId]['sub_category_ids'].indexOf(subCategoryId);
            $scope.categoriesHash[categoryId]['sub_category_ids'].splice(subCatIndex, 1);
        } else {
            //todo : don't mark delete
        }
    }

    $scope.addCategory = function(categoryId, isAtTheEnd) {
        var categoryName = "";
        if(!categoryId && !isAtTheEnd) return;
        if(isAtTheEnd) {
            categoryName = $scope.newCategoryAtTheEnd.name;
        } else {
            categoryName = $scope.newCategoryObject[categoryId + '_new'].name;
            $scope.newCategoryObject[categoryId + '_new'].name = "";
        }
        $scope.newCategoryAtTheEnd.name = "";
        if(!categoryName || !categoryName.trim()) {
            return;
        }
        var newGUID = generateGUID();
        var followedCategoryIndex;

        $scope.categoriesHash[newGUID] = {
            name : categoryName,
            sub_category_ids : [],
            state : 'insert'
        }

        $scope.newSubCategoryObject[newGUID + '_new'] = {
            name : '',
            state : 'insert'
        }

        $scope.newCategoryObject[newGUID + '_new'] = {
            name : ''
        }

        if(isAtTheEnd) {
            $scope.categories.push(newGUID)
            return;
        }
        followedCategoryIndex = $scope.categories.indexOf(categoryId);
        $scope.categories.splice(followedCategoryIndex, 0, newGUID);
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.categoryModified = function(categoryId) {
        if(!categoryId) return;
        $scope.categoriesHash[categoryId].state = 'modified';
    }

    $scope.removeCategory = function(categoryId) {
        if(!categoryId) return;
        var result = confirm( "Are you sure baby?" );
        if (result) {
            let catIndex = $scope.categories.indexOf(categoryId);
            $scope.categoriesHash[categoryId].state = 'deleted';
            $scope.categories.splice(catIndex, 1);
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        } else {
            //todo : don't mark delete
        }
    }


    $scope.response = {
data:
{
stockCategoryListTags:
{
tag1: "Alcohol Name",
tag2: "High",
tag3: "Low",
tag4: "Price(Rs.)",
tag5: "Mixer Available"
},
stockCategoryList:
[
{
sub_category_ids:
[
"id_breezer"
],
_id: "58ca53f170cc840757dfb086",
type: "category",
id: "id_alcopop",
name: "ALCOPOP",
sub_category_count_text: "1 Item",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_jack_daniels",
"id_irish_jameson",
"id_jim_beam_white"
],
_id: "58ca53f170cc840757dfb087",
type: "category",
id: "id_american_irish_whisky",
name: "AMERICAN IRISH WHISKY",
sub_category_count_text: "3 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_bud_magnum",
"id_budweiser",
"id_corona",
"id_fosters",
"id_heineken_beer",
"id_kingfisher_ultra",
"id_miller_high_lige"
],
_id: "58ca53f170cc840757dfb088",
type: "category",
id: "id_beers",
name: "BEERS",
sub_category_count_text: "7 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_chandon_brut_bottle",
"id_sula_brut_btl",
"id_sula_rose_wine_btl"
],
_id: "58ca53f170cc840757dfb089",
type: "category",
id: "id_champagne",
name: "CHAMPAGNE",
sub_category_count_text: "3 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_bacardi_cuba_life",
"id_bacardi_mojito",
"id_black_russian",
"id_bloody_mary"
],
_id: "58ca53f170cc840757dfb08a",
type: "category",
id: "id_classic_cocktails",
name: "CLASSIC COCKTAILS",
sub_category_count_text: "4 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_beefeater",
"id_bombay_sapphire",
"id_gordons"
],
_id: "58ca53f170cc840757dfb08b",
type: "category",
id: "id_gin",
name: "GIN",
sub_category_count_text: "3 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_house_red_wine_btl",
"id_house_white_wine_btl"
],
_id: "58ca53f170cc840757dfb08c",
type: "category",
id: "id_house_wine",
name: "HOUSE WINE",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_jacob_creek_btl",
"id_jacob_creek_by_glass"
],
_id: "58ca53f170cc840757dfb08d",
type: "category",
id: "id_imported_wine",
name: "IMPORTED WINE",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_baileys_irish_cream",
"id_kahlua"
],
_id: "58ca53f170cc840757dfb08e",
type: "category",
id: "id_liquers",
name: "LIQUERS",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_appletini",
"id_classic_martini"
],
_id: "58ca53f170cc840757dfb08f",
type: "category",
id: "id_martini",
name: "MARTINI",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_coke",
"id_diet_coke",
"id_ginger_ale",
"id_juice",
"id_on_the_rocks",
"id_red_bull",
"id_soda",
"id_sprite",
"id_thums_up",
"id_tonic_water"
],
_id: "58ca53f170cc840757dfb090",
type: "category",
id: "id_mixers",
name: "MIXERS",
sub_category_count_text: "10 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_sweet_heart",
"id_chill_out"
],
_id: "58ca53f170cc840757dfb091",
type: "category",
id: "id_non_alcoholic",
name: "NON ALCOHOLIC",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_black_n_white",
"id_black_dog_12_yo",
"id_vat_69"
],
_id: "58ca53f170cc840757dfb092",
type: "category",
id: "id_premium_whisky",
name: "PREMIUM WHISKY",
sub_category_count_text: "3 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_bacardi_black",
"id_captain_morgan"
],
_id: "58ca53f170cc840757dfb093",
type: "category",
id: "id_rum",
name: "RUM",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_ballantines",
"id_dewars_white_label"
],
_id: "58ca53f170cc840757dfb094",
type: "category",
id: "id_scotch_whisky",
name: "SCOTCH WHISKY",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_b52",
"id_kamikaze",
"id_tequila"
],
_id: "58ca53f170cc840757dfb095",
type: "category",
id: "id_shots",
name: "SHOTS",
sub_category_count_text: "3 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_cardhu",
"id_oban"
],
_id: "58ca53f170cc840757dfb096",
type: "category",
id: "id_single_malts",
name: "SINGLE MALTS",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_absolut",
"id_ciroc"
],
_id: "58ca53f170cc840757dfb097",
type: "category",
id: "id_vodka",
name: "VODKA",
sub_category_count_text: "2 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
},
{
sub_category_ids:
[
"id_antiquity_blue",
"id_blenders_pride",
"id_signature"
],
_id: "58ca53f170cc840757dfb098",
type: "category",
id: "id_whisky",
name: "WHISKY",
sub_category_count_text: "3 Items",
img_url: "http://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Alcohol-Bottle-PNG-Transparent-Image.png",
__v: 0
}
],
stockSubCategoryList:
[
{
_id: "58ca53f170cc840757dfb099",
type: "sub_category",
quantity: 100,
id: "id_breezer",
parent_id: "id_alcopop",
name: "BREEZER",
low: 90,
high: 130,
min_price: 110,
max_price: 110,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.387Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb09a",
type: "sub_category",
quantity: 100,
id: "id_jack_daniels",
parent_id: "id_american_irish_whisky",
name: "JACK DANIELS",
low: 250,
high: 300,
min_price: 230,
max_price: 300,
price: 275,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.390Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb09b",
type: "sub_category",
quantity: 100,
id: "id_irish_jameson",
parent_id: "id_american_irish_whisky",
name: "IRISH JAMESON",
low: 120,
high: 180,
min_price: 110,
max_price: 200,
price: 150,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.392Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb09c",
type: "sub_category",
quantity: 100,
id: "id_jim_beam_white",
parent_id: "id_american_irish_whisky",
name: "JIM BEAM WHITE",
low: 90,
high: 110,
min_price: 90,
max_price: 120,
price: 93,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.395Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb09d",
type: "sub_category",
quantity: 100,
id: "id_bud_magnum",
parent_id: "id_beers",
name: "BUD MAGNUM",
low: 110,
high: 120,
min_price: 100,
max_price: 120,
price: 115,
sold_quantity: 6,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.397Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb09e",
type: "sub_category",
quantity: 100,
id: "id_budweiser",
parent_id: "id_beers",
name: "BUDWEISER",
low: 100,
high: 120,
min_price: 100,
max_price: 140,
price: 115,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.398Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb09f",
type: "sub_category",
quantity: 100,
id: "id_corona",
parent_id: "id_beers",
name: "CORONA",
low: 300,
high: 400,
min_price: 290,
max_price: 400,
price: 345,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.403Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a0",
type: "sub_category",
quantity: 100,
id: "id_fosters",
parent_id: "id_beers",
name: "FOSTERS",
low: 80,
high: 110,
min_price: 80,
max_price: 120,
price: 103,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.407Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a1",
type: "sub_category",
quantity: 100,
id: "id_heineken_beer",
parent_id: "id_beers",
name: "HEINEKEN BEER",
low: 115,
high: 145,
min_price: 100,
max_price: 150,
price: 130,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.411Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a2",
type: "sub_category",
quantity: 100,
id: "id_kingfisher_ultra",
parent_id: "id_beers",
name: "KINGFISHER ULTRA",
low: 115,
high: 145,
min_price: 115,
max_price: 160,
price: 130,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.416Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a3",
type: "sub_category",
quantity: 100,
id: "id_miller_high_lige",
parent_id: "id_beers",
name: "MILLER HIGH LIGE",
low: 95,
high: 130,
min_price: 90,
max_price: 130,
price: 120,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.418Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a4",
type: "sub_category",
quantity: 100,
id: "id_chandon_brut_bottle",
parent_id: "id_champagne",
name: "CHANDON BRUT BOTTLE",
low: 1200,
high: 1245,
min_price: 1189,
max_price: 1250,
price: 1210,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.422Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a5",
type: "sub_category",
quantity: 100,
id: "id_sula_brut_btl",
parent_id: "id_champagne",
name: "SULA BRUT BTL",
low: 1200,
high: 1300,
min_price: 1200,
max_price: 1330,
price: 1278,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.425Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a6",
type: "sub_category",
quantity: 100,
id: "id_sula_rose_wine_btl",
parent_id: "id_champagne",
name: "SULA ROSE WINE BTL",
low: 550,
high: 600,
min_price: 550,
max_price: 600,
price: 567,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.426Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a7",
type: "sub_category",
quantity: 100,
id: "id_bacardi_cuba_life",
parent_id: "id_classic_cocktails",
name: "BACARDI CUBA LIFE",
low: 220,
high: 260,
min_price: 220,
max_price: 300,
price: 245,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.428Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a8",
type: "sub_category",
quantity: 100,
id: "id_bacardi_mojito",
parent_id: "id_classic_cocktails",
name: "BACARDI MOJITO",
low: 230,
high: 260,
min_price: 230,
max_price: 270,
price: 256,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.430Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0a9",
type: "sub_category",
quantity: 100,
id: "id_black_russian",
parent_id: "id_classic_cocktails",
name: "BLACK RUSSIAN",
low: 240,
high: 260,
min_price: 230,
max_price: 290,
price: 245,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.431Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0aa",
type: "sub_category",
quantity: 100,
id: "id_bloody_mary",
parent_id: "id_classic_cocktails",
name: "BLOODY MARY",
low: 240,
high: 260,
min_price: 240,
max_price: 300,
price: 245,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.433Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0ab",
type: "sub_category",
quantity: 100,
id: "id_beefeater",
parent_id: "id_gin",
name: "BEEFEATER",
low: 100,
high: 120,
min_price: 100,
max_price: 140,
price: 110,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.440Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0ac",
type: "sub_category",
quantity: 100,
id: "id_bombay_sapphire",
parent_id: "id_gin",
name: "BOMBAY SAPPHIRE",
low: 100,
high: 150,
min_price: 100,
max_price: 170,
price: 130,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.442Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0ad",
type: "sub_category",
quantity: 100,
id: "id_gordons",
parent_id: "id_gin",
name: "GORDONS",
low: 90,
high: 98,
min_price: 90,
max_price: 100,
price: 96,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.443Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0ae",
type: "sub_category",
quantity: 100,
id: "id_house_red_wine_btl",
parent_id: "id_house_wine",
name: "HOUSE RED WINE BTL",
low: 780,
high: 900,
min_price: 750,
max_price: 910,
price: 834,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.446Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0af",
type: "sub_category",
quantity: 100,
id: "id_house_white_wine_btl",
parent_id: "id_house_wine",
name: "HOUSE WHITE WINE BTL",
low: 150,
high: 200,
min_price: 150,
max_price: 200,
price: 170,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.448Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b0",
type: "sub_category",
quantity: 100,
id: "id_jacob_creek_btl",
parent_id: "id_imported_wine",
name: "JACOB CREEK BTL",
low: 1200,
high: 1300,
min_price: 1200,
max_price: 1310,
price: 1256,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.458Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b1",
type: "sub_category",
quantity: 100,
id: "id_jacob_creek_by_glass",
parent_id: "id_imported_wine",
name: "JACOB CREEK BY GLASS",
low: 240,
high: 300,
min_price: 230,
max_price: 300,
price: 256,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.459Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b2",
type: "sub_category",
quantity: 100,
id: "id_baileys_irish_cream",
parent_id: "id_liquers",
name: "BAILEYS IRISH CREAM",
low: 230,
high: 258,
min_price: 220,
max_price: 300,
price: 285,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.461Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b3",
type: "sub_category",
quantity: 100,
id: "id_kahlua",
parent_id: "id_liquers",
name: "KAHLUA",
low: 210,
high: 290,
min_price: 200,
max_price: 300,
price: 256,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.463Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b4",
type: "sub_category",
quantity: 100,
id: "id_appletini",
parent_id: "id_martini",
name: "APPLETINI",
low: 230,
high: 258,
min_price: 220,
max_price: 300,
price: 245,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.464Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b5",
type: "sub_category",
quantity: 100,
id: "id_classic_martini",
parent_id: "id_martini",
name: "CLASSIC MARTINI",
low: 240,
high: 300,
min_price: 230,
max_price: 310,
price: 256,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.465Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b6",
type: "sub_category",
quantity: 100,
id: "id_coke",
parent_id: "id_mixers",
name: "COKE",
low: 24,
high: 30,
min_price: 20,
max_price: 35,
price: 25,
sold_quantity: 4,
price_indicator: 1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.468Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b7",
type: "sub_category",
quantity: 100,
id: "id_diet_coke",
parent_id: "id_mixers",
name: "DIET COKE",
low: 25,
high: 38,
min_price: 23,
max_price: 40,
price: 30,
sold_quantity: 3,
price_indicator: -1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.470Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b8",
type: "sub_category",
quantity: 100,
id: "id_ginger_ale",
parent_id: "id_mixers",
name: "GINGER ALE",
low: 80,
high: 84,
min_price: 80,
max_price: 84,
price: 80,
sold_quantity: 0,
price_indicator: 1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.473Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0b9",
type: "sub_category",
quantity: 100,
id: "id_juice",
parent_id: "id_mixers",
name: "JUICE",
low: 44,
high: 60,
min_price: 40,
max_price: 65,
price: 56,
sold_quantity: 0,
price_indicator: -1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.474Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0ba",
type: "sub_category",
quantity: 100,
id: "id_on_the_rocks",
parent_id: "id_mixers",
name: "ON THE ROCKS",
low: 5,
high: 8,
min_price: 5,
max_price: 10,
price: 6,
sold_quantity: 0,
price_indicator: -1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.475Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0bb",
type: "sub_category",
quantity: 100,
id: "id_red_bull",
parent_id: "id_mixers",
name: "RED BULL",
low: 110,
high: 115,
min_price: 110,
max_price: 120,
price: 110,
sold_quantity: 3,
price_indicator: 1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.476Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0bc",
type: "sub_category",
quantity: 100,
id: "id_soda",
parent_id: "id_mixers",
name: "SODA",
low: 2,
high: 4,
min_price: 1,
max_price: 5,
price: 3,
sold_quantity: 0,
price_indicator: -1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.476Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0bd",
type: "sub_category",
quantity: 100,
id: "id_sprite",
parent_id: "id_mixers",
name: "SPRITE",
low: 25,
high: 28,
min_price: 25,
max_price: 30,
price: 25,
sold_quantity: 0,
price_indicator: 1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.478Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0be",
type: "sub_category",
quantity: 100,
id: "id_thums_up",
parent_id: "id_mixers",
name: "THUMS UP",
low: 25,
high: 30,
min_price: 25,
max_price: 32,
price: 26,
sold_quantity: 0,
price_indicator: 1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.479Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0bf",
type: "sub_category",
quantity: 100,
id: "id_tonic_water",
parent_id: "id_mixers",
name: "TONIC WATER",
low: 82,
high: 88,
min_price: 70,
max_price: 90,
price: 85,
sold_quantity: 0,
price_indicator: -1,
mixer_available: false,
updated_at: "2017-03-16T08:59:29.480Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c0",
type: "sub_category",
quantity: 100,
id: "id_sweet_heart",
parent_id: "id_non_alcoholic",
name: "BERRY SWEET HEART",
low: 240,
high: 280,
min_price: 220,
max_price: 350,
price: 256,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.482Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c1",
type: "sub_category",
quantity: 100,
id: "id_chill_out",
parent_id: "id_non_alcoholic",
name: "CHILL OUT",
low: 290,
high: 350,
min_price: 280,
max_price: 390,
price: 356,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.484Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c2",
type: "sub_category",
quantity: 100,
id: "id_black_n_white",
parent_id: "id_premium_whisky",
name: "BLACK N WHITE",
low: 100,
high: 150,
min_price: 100,
max_price: 155,
price: 145,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.486Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c3",
type: "sub_category",
quantity: 100,
id: "id_black_dog_12_yo",
parent_id: "id_premium_whisky",
name: "BLACK DOG 12 YO",
low: 106,
high: 135,
min_price: 105,
max_price: 140,
price: 130,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.488Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c4",
type: "sub_category",
quantity: 100,
id: "id_vat_69",
parent_id: "id_premium_whisky",
name: "VAT 69",
low: 81,
high: 97,
min_price: 76,
max_price: 100,
price: 87,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.490Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c5",
type: "sub_category",
quantity: 100,
id: "id_bacardi_black",
parent_id: "id_rum",
name: "BACARDI BLACK",
low: 23,
high: 25,
min_price: 22,
max_price: 30,
price: 24,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.492Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c6",
type: "sub_category",
quantity: 100,
id: "id_captain_morgan",
parent_id: "id_rum",
name: "CAPTAIN MORGAN",
low: 26,
high: 30,
min_price: 26,
max_price: 35,
price: 32,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.493Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c7",
type: "sub_category",
quantity: 100,
id: "id_ballantines",
parent_id: "id_scotch_whisky",
name: "BALLANTINES",
low: 103,
high: 160,
min_price: 100,
max_price: 170,
price: 150,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.494Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c8",
type: "sub_category",
quantity: 100,
id: "id_dewars_white_label",
parent_id: "id_scotch_whisky",
name: "DEWARS WHITE LABEL",
low: 135,
high: 150,
min_price: 133,
max_price: 150,
price: 143,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.497Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0c9",
type: "sub_category",
quantity: 100,
id: "id_b52",
parent_id: "id_shots",
name: "B52",
low: 250,
high: 260,
min_price: 230,
max_price: 275,
price: 255,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.499Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0ca",
type: "sub_category",
quantity: 100,
id: "id_kamikaze",
parent_id: "id_shots",
name: "KAMIKAZE",
low: 150,
high: 156,
min_price: 150,
max_price: 160,
price: 152,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.500Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0cb",
type: "sub_category",
quantity: 100,
id: "id_tequila",
parent_id: "id_shots",
name: "TEQUILA",
low: 250,
high: 260,
min_price: 240,
max_price: 270,
price: 87,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.503Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0cc",
type: "sub_category",
quantity: 100,
id: "id_cardhu",
parent_id: "id_single_malts",
name: "CARDHU",
low: 387,
high: 403,
min_price: 380,
max_price: 410,
price: 390,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.504Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0cd",
type: "sub_category",
quantity: 100,
id: "id_oban",
parent_id: "id_single_malts",
name: "OBAN",
low: 382,
high: 390,
min_price: 370,
max_price: 400,
price: 389,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.505Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0ce",
type: "sub_category",
quantity: 100,
id: "id_absolut",
parent_id: "id_vodka",
name: "ABSOLUT",
low: 106,
high: 121,
min_price: 100,
max_price: 130,
price: 120,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.506Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0cf",
type: "sub_category",
quantity: 100,
id: "id_ciroc",
parent_id: "id_vodka",
name: "CIROC",
low: 223,
high: 232,
min_price: 210,
max_price: 240,
price: 229,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.507Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0d0",
type: "sub_category",
quantity: 100,
id: "id_antiquity_blue",
parent_id: "id_whisky",
name: "ANTIQUITY BLUE",
low: 48,
high: 65,
min_price: 40,
max_price: 75,
price: 63,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.508Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0d1",
type: "sub_category",
quantity: 100,
id: "id_blenders_pride",
parent_id: "id_whisky",
name: "BLENDERS PRIDE",
low: 44,
high: 60,
min_price: 40,
max_price: 70,
price: 55,
sold_quantity: 0,
price_indicator: 1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.509Z",
__v: 0
},
{
_id: "58ca53f170cc840757dfb0d2",
type: "sub_category",
quantity: 100,
id: "id_signature",
parent_id: "id_whisky",
name: "SIGNATURE",
low: 41,
high: 59,
min_price: 39,
max_price: 65,
price: 58,
sold_quantity: 0,
price_indicator: -1,
mixer_available: true,
updated_at: "2017-03-16T08:59:29.510Z",
__v: 0
}
]
}
};


    $scope.getCategories = function() {
        $scope.formatCategories(Object.assign({}, $scope.response));
    }

    $scope.getCategories();

})
