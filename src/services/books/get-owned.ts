import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import { OAuth } from 'oauth';
import * as Xml2Js from 'xml2js';

import IOptions from '../../ioptions';

export default function getBooksOwned(
  options: IOptions,
  event: APIGatewayEvent,
  context: Context,
  cb: Callback,
) {
  const requestBody = JSON.parse(event.body);

  console.error(requestBody);

  if (
    !requestBody ||
    !requestBody.accessToken ||
    !requestBody.accessTokenSecret
  ) {
    return cb(null, {
      body: JSON.stringify({
        message:
          'JSON body is required with `accessToken` and `accessTokenSecret` keys',
      }),
      statusCode: 400,
    });
  }

  const oa = new OAuth(
    `${options.baseUrl}${options.requestTokenUrlPath}`,
    `${options.baseUrl}${options.accessTokenUrlPath}`,
    options.clientKey,
    options.clientSecret,
    options.oauthVersion,
    options.redirectUri,
    options.oauthEncryption,
  );

  oa.get(
    `${options.baseUrl}/owned_books/user?format=xml`,
    requestBody.accessToken,
    requestBody.accessTokenSecret,
    (err, data, response) => {
      console.log(data);
      if (err) {
        return cb(null, {
          body: JSON.stringify({
            message: `Error getting Owned books : ${JSON.stringify(err)}`,
          }),
          statusCode: 500,
        });
      }

      const parser = new Xml2Js.Parser();

      parser.on('end', result => {
        console.log(result);
        const books = result.GoodreadsResponse.owned_books[0].owned_book;

        cb(null, {
          body: JSON.stringify({
            message: 'Owned Books Retrieved',
            result: {
              ownedBooks: books.map(ob => {
                const ownedBook: any = {};

                ownedBook.id = ob.id[0]._;
                ownedBook.orignialPurchaseDate = ob.original_purchase_date[0]._;
                ownedBook.orignialPurchaseLocation =
                  ob.original_purchase_location[0]._;
                ownedBook.condition = ob.condition[0];
                ownedBook.tradedCount = ob.traded_count[0];
                ownedBook.link = ob.link[0];

                ownedBook.book = {};
                ownedBook.book.id = ob.book[0].id[0]._;
                ownedBook.book.isbn = ob.book[0].isbn[0];
                ownedBook.book.isbn13 = ob.book[0].isbn13[0];
                ownedBook.book.textReviewsCount =
                  ob.book[0].text_reviews_count[0]._;
                ownedBook.book.uri = ob.book[0].uri[0];
                ownedBook.book.title = ob.book[0].title[0];
                ownedBook.book.titleWithoutSeries =
                  ob.book[0].title_without_series[0];
                ownedBook.book.imageUrl = ob.book[0].image_url[0];
                ownedBook.book.smallImageUrl = ob.book[0].small_image_url[0];
                ownedBook.book.largeImageUrl = ob.book[0].large_image_url[0];
                ownedBook.book.link = ob.book[0].link[0];
                ownedBook.book.numPages = ob.book[0].num_pages[0];
                ownedBook.book.format = ob.book[0].format[0];
                ownedBook.book.editionInformation =
                  ob.book[0].edition_information[0];
                ownedBook.book.publisher = ob.book[0].publisher[0];
                ownedBook.book.publicationDay = ob.book[0].publication_day[0];
                ownedBook.book.publicationYear = ob.book[0].publication_year[0];
                ownedBook.book.publicationMonth =
                  ob.book[0].publication_month[0];
                ownedBook.book.averageRating = ob.book[0].average_rating[0];
                ownedBook.book.ratingsCount = ob.book[0].ratings_count[0];
                ownedBook.book.description = ob.book[0].description[0];
                ownedBook.book.published = ob.book[0].published[0];

                ownedBook.book.authors = ob.book[0].authors[0].author.map(a => {
                  const author: any = {};

                  author.id = a.id[0];
                  author.name = a.name[0];
                  author.role = a.role[0];
                  author.imageUrl = a.image_url[0]._;
                  author.smallImageUrl = a.small_image_url[0]._;
                  author.link = a.link[0];
                  author.averageRating = a.average_rating[0];
                  author.ratingsCount = a.ratings_count[0];
                  author.textReviewsCount = a.text_reviews_count[0];

                  return author;
                });

                ownedBook.book.work = {
                  id: ob.book[0].work[0].id[0],
                  uri: ob.book[0].work[0].uri[0],
                };

                ownedBook.review = {};
                ownedBook.review.id = ob.review[0].id[0];
                ownedBook.review.rating = ob.review[0].rating[0];
                ownedBook.review.votes = ob.review[0].votes[0];
                ownedBook.review.spoilerFlag = ob.review[0].spoiler_flag[0];
                ownedBook.review.spoilersState = ob.review[0].spoilers_state[0];
                ownedBook.review.recommendedFor =
                  ob.review[0].recommended_for[0];
                ownedBook.review.recommendedBy = ob.review[0].recommended_by[0];
                ownedBook.review.startedAt = ob.review[0].started_at[0];
                ownedBook.review.readAt = ob.review[0].read_at[0];
                ownedBook.review.dateAdded = ob.review[0].date_added[0];
                ownedBook.review.dateUpdated = ob.review[0].date_updated[0];
                ownedBook.review.readCount = ob.review[0].read_count[0];
                ownedBook.review.body = ob.review[0].body[0];
                ownedBook.review.commentsCount = ob.review[0].comments_count[0];
                ownedBook.review.url = ob.review[0].url[0];
                ownedBook.review.link = ob.review[0].link[0];
                ownedBook.review.owned = ob.review[0].owned[0];

                ownedBook.review.shelves = ob.review[0].shelves[0].shelf.map(
                  s => {
                    const shelf: any = {};

                    shelf.id = s.$.id;
                    shelf.name = s.$.name;
                    shelf.reviewShelfId = s.$.review_shelf_id;
                    shelf.exclusive = s.$.exclusive;
                    shelf.sortable = s.$.sortable;

                    return shelf;
                  },
                );

                return ownedBook;
              }),
            },
          }),
          statusCode: 200,
        });
      });

      parser.parseString(data.toString());
    },
  );
}
