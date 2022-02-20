from api.exposed import initialize, update_board

BOARD_NAME = 'sss'  # enter the board's name (id) as it is on the web app

###############################################

SERVER_ROOT_URL = 'https://ttt-pydriven.herokuapp.com/'

board = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1]
]


def main():
    initialize(SERVER_ROOT_URL)

    for i in range(3):
        board[0][i] = i if i < 2 else 0

        print('updating ....')
        updated_board = update_board(BOARD_NAME, board)
        if type(updated_board) is str:
            print('Could not update board.')
            print(f'\tError: {updated_board}')
        else:
            print('Successfully updated board')


if __name__ == '__main__':
    main()
