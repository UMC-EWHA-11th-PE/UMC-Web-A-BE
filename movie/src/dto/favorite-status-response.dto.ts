export class FavoriteStatusResponseDto {
    isFavorite: boolean;    //dto가 어떤 데이터 갖고 있을지 정의

                    //매개변수 값
    static from(isFavorite:boolean) : FavoriteStatusResponseDto {
        return {isFavorite};    //실제 값을 가진 객체를 만들어 반환
    }
}