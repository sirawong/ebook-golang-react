package repository

import (
	"context"
	"io"
	"log"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/spf13/viper"
)

func CldryConnect() *cloudinary.Cloudinary {
	cld, err := cloudinary.NewFromParams(viper.GetString("db.cldname"), viper.GetString("db.cldapi"), viper.GetString("db.cldsecret"))
	if err != nil {
		log.Fatal(err)
	}
	return cld
}

func (b bookRepositoryDB) UploadImage(image io.Reader) (*Image, error) {
	ctx := context.Background()
	resp, err := b.cld.Upload.Upload(ctx, image, uploader.UploadParams{Folder: "books", UseFilename: true, UniqueFilename: true})
	if err != nil {
		return nil, err
	}

	return &Image{PublicID: resp.PublicID, ImageUrl: resp.SecureURL}, nil
}

func (b bookRepositoryDB) DeleteImage(image Image) error {
	ctx := context.Background()
	imageDelete := uploader.DestroyParams{
		PublicID: image.PublicID,
	}
	_, err := b.cld.Upload.Destroy(ctx, imageDelete)
	if err != nil {
		return err
	}
	return nil
}
