module.exports = {
    static: {
        APP_NAME: 'Planet Plant',
    },
    api_req_data: {
        api_key: "-- ask for one: https://web.plant.id/api-access-request/ --",
        images: [],
        /* modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers */
        modifiers: ["crops_fast", "similar_images", "health_all", "disease_similar_images"],
        plant_language: "en",
        /* plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details */
        plant_details: ["common_names",
            "url",
            "name_authority",
            "wiki_description",
            "taxonomy",
            "synonyms"],
        /* disease details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Disease-details */
        disease_details: ["common_names", "url", "description"]
    }
}