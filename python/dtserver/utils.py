def safe_issubclass(v1, v2):
    try:
        return issubclass(v1, v2)
    except:
        return False