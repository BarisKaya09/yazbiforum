package types

type User struct {
	Name         string       `json:"name"`
	Surname      string       `json:"surname"`
	DateOfBirth  string       `json:"dateOfBirth"`
	Nickname     string       `json:"nickname"`
	Email        string       `json:"email"`
	Password     string       `json:"password"`
	Forums       any          `json:"forums"`
	Interactions Interactions `json:"interactions"`
	// kullanıcının etkileşim kurduğu forumların id bilgilerinin tutulacağı yer.(beğendiği forum, yorum yaptığı forum)
}

type Interactions struct {
	LikedForums []LikedForums
	// kullanıcının yorum yaptığı forumların id bilgileri burada saklanacak.
	Commented []Commented
}

type LikedForums struct {
	Id          string
	Author      string
	Title       string
	ReleaseDate string
}

type Commented struct {
	Id          string
	Author      string
	Title       string
	ReleaseDate string
	Comment     InteractionComment
}

type InteractionComment struct {
	Id          string
	Content     string
	ReleaseDate string
}

// forum
type Forum struct {
	Id          string
	Author      string
	Tag         []Tags
	Title       string
	Content     string
	Type_       ForumType
	ReleaseDate string
	LastUpdate  string
	Comments    []Comment
	Likes       Likes
}

type Comment struct {
	Id          string
	Author      string
	Content     string
	ReleaseDate string
}

// typescript'deki string literal union type'ın Go'daki versiyonu
type Tags string

const (
	Bilim       Tags = "bilim"
	Yazilim     Tags = "yazılım"
	Grafik      Tags = "grafik"
	Siyaset     Tags = "siyaset"
	SosyalMedya Tags = "sosyal medya"
	Yazarlik    Tags = "yazarlık"
	Matematik   Tags = "matematik"
	Edebiyat    Tags = "edebiyat"
	Ingilizce   Tags = "ingilizce"
	Oyun        Tags = "oyun"
	Yayincilik  Tags = "yayıncılık"
	Zeka        Tags = "zeka"
	Gundem      Tags = "gündem"
	Guvenlik    Tags = "güvenlik"
	Muhendislik Tags = "mühendislik"
	Yemek       Tags = "yemek"
	Airsoft     Tags = "airsoft"
	Saglik      Tags = "sağlık"
	Ekonomi     Tags = "ekonomi"
	Elektronik  Tags = "elektronik"
	Ticaret     Tags = "ticaret"
	Sanat       Tags = "sanat"
	Muzik       Tags = "müzik"
	Egitim      Tags = "eğitim"
	Futbol      Tags = "futbol"
	Basketbol   Tags = "basketbol"
	Voleybol    Tags = "voleybol"
	Spor        Tags = "spor"
)

type ForumType string

const (
	Discussion  ForumType = "tartışma"
	Question    ForumType = "soru"
	Information ForumType = "bilgi"
)

type Likes struct {
	Count int64    `json:"count"`
	Users []string `json:"users"`
}
