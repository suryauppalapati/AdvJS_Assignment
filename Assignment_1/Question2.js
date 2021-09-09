const GithubAPI = () => {
    console.clear();
    let search = $("#search").val()
    url = "https://api.github.com/search/repositories?q=" + search;
    fetch(url).then(res => res.json())
        .then(data => {
            apiCall(data)
            .then(result => console.log(result));
        });
}

const apiCall = async (data) => {
    result = [];
    for (const item of data.items) {
        let owner = {
            login : item.owner.login
        };

        try {
            await fetch(item.owner.url).then(res => res.json()).then((apidata) => {
               owner.name = apidata.name;
            });
        } catch {
            owner.name = "";
        }
        
        try {
            await fetch(item.owner.followers_url).then(res => res.json()).then((apidata) => {
                owner.followersCount = apidata.length;
            });
        } catch {
            owner.followersCount = 0;
        }

        try {
            mainurl = item.owner.following_url.split("{")[0];
            await fetch(mainurl).then(res => res.json()).then((apidata) => {
                owner.followingCount = apidata.length;
            });
        } catch {
            owner.followingCount = 0;
        }

        let numberOfBranch = 0;
        try {
            mainurl = item.branches_url.split("{")[0];
            await fetch(mainurl).then(res => res.json()).then((apidata) => {
                numberOfBranch= apidata.length;
            });
        } catch {
            numberOfBranch = 0;
        }

        let license = ""
        if(item.license) {
            license = item.license.name
        } else {
            license = ""
        }

        result.push({
            name: item.name,
            full_name: item.full_name,
            private: item.private,
            score: item.score,
            owner,
            numberOfBranch,
            license
        });
    console.clear();
    }
    alert("Please Check Console");
    return result;

}