from controller.api import internal


def initialize(base_url):
    internal.BASE_URL = base_url


def update_board(name, matrix):
    """
    :param name: board's name which is being updated
    :param matrix:
    :return:
    """
    updated_board = internal.update(name, matrix)
    return updated_board
