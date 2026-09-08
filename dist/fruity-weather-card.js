const ge = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAANlBMVEX///8AAAD61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jEvrlu0AAAAEXRSTlMAACC/nxDPQDBggHBQ3++vj2vrwJYAAAI8SURBVGje7ZntcoQgDEW3Koagonn/l63dVVfc8BGRaWfq/elIjmASSHg8bt26Tl8JqmqiRqW8eRLQ0qy6HADoKV0aADfgBvwFABpUMoDqTJ8MUD8BO2hJoGk7P29SAeZpxjJ2Bk+qeNon6hMBNfkIP8muVj77ZBIBI3kJrFb71CUClqVOJWz2bZXqRUjMkLh9LXDTlRDP/Yq1Hw20jVAlBt9xOaORvBJ0IuD4u+Kp4kUYXC+F3pgenFlVvDsk5CK07jhohnXdhkm7X/LpbinJTgG8Ywo368vfh928IDub6po+NKrr0jVaYmThKsBEHuE1AK/9EEEAQAoI8gE6ZJ+syga0QYCzi50CIEUEmYAhBhjzAEBRVVmAJg7osgA2DmjTAXPWeqlK89FFb4/ejWcAapfQ1qMJpAAWP9qPHxUDqBn3NgKAO54BcPMWAJQb4b8BKL5Eapd12uUn9wKAbvdOwropbDrnpttw/VuBxmiMA6YsAMYBunC6rjP3g670hhObQp29J4fznbdCERxbgouEVxy8msIHrwABrzr8dmL70uM7ML7U6tzju9oXFuaQlYbd54M+BTiWUPjOS7bp3ffaSg7gikBAM6vXn3WyvAhEYZ0sLWNLF+IY3k2cOvlMKwEl7Rb+5SBAy9o5yJU7QcAkbEghCRtSo9e+ashOyktIbal13u/33R/gR3LKamsyrgv24HLRxmwnbMxWxuDdHL8B/wlQ7qLutT0WvGr80sO7fisCmBFV2nv37fZ/0jd8XYU1Jx0TswAAAABJRU5ErkJggg==", ue = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAQAAADtcJt4AAACpElEQVR42u2a3ZXTMBCFr/ZQgKgAbwU4Faw6IFSAt4JNBywVGCoIVBCoIEsFdiqIO7A6uDzsyUmcOLEsWyvpoJunvNjzSZrx/EgQcesOCSABJIAEkAASQAJIANZ6d/pHzPZYZsgAALXQrkznJcDEB0ooPCCHOnuNRo2/qMVvRxzH34SnFNxwWGsu57Z8MgAln9nSXHsWAQGwGGX8QRVVAADMuKW9SkqvAFRWa9/dh9wbAAvOoXYKwgQArjmXWvu4ZA3AknPKehcsAWY6PDMgWAEwpwtVNhHJAoCSe7pR+TYAJd1J2QEIGmejzFE5zItrsbDJRsfUAyVcKrfLkYx3gApb59WJRg1AY4eX4UqC49Jpo3R5Xm1Z3IpOo5yYGf2o5foaxKvNpj6whB9JFNjzeXJFxop+1ZO5jgijlGi9tx80HrtV9ZgwmsO/JDZ9gdYMQCEMrS8RzAA+BNPHKs99wQwgCwZAYtMNq3eD+eeKVTBH6HUxV4apBCVWeIJEeLoXzWAUokKFr0GaDzwN7gALrANuSWvx/uYOBG4+II+9jB4ALgM3HwA+XQVgFoH5J7nBhQ9w4y3zHFeJiV4foIrDfODwRT4/Ql8Qi2QPACUKIOYppQLiBshjB3iIyHId+aBb1HED1LFfNYge4E8/gI7FgY8Nli7ALhKAH1cKGridAMwXQO+F7i1oRI0mhvU/bbyfO/Gv4M1v8P1GV4IS+0AL+YMWh09Ybz0gNL4Fbf6jqAfb6x5mMaYqjCY0lN6nAQbm35wPUGIbWGrd4PP54bnRFxJaLLq+7lk/j647YsRE5exiwbhZpZowpeTSo0u3LJnNctWACgofIQHkjr8SDRoADXZ4uXpoOj4gCKS70wkgASSABJAAEkACSAAJIAEkgASQAP5HgH85ozJI/7xJQQAAAABJRU5ErkJggg==", fe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAZlBMVEX///8AAAD///////////////////////////////////////////////////////////82yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOv///82yOvBYtReAAAAIHRSTlMAABBAcIAwUJ/fvyDvr89gj1C/EJ8gj69Az4DvcN9gMHkfTpoAAAJTSURBVGje7djtjqowEAbgpXzTAgsoynrU8f5v8khNzAJtGTpDTk7i+9cwj9jpQP36+gSZYCUijGKdMAmQ2QCkWQ6/UkSSExCxgkXKkAswlte3EbIAqaX8mEyQAVGCK3lCBJIKVlKTgEQBUIQ1AFPfKawAElUfIPUERIWrDyrxA74Bm8oLCAGf2AfINwAgtwPxlvqQbQcUbExefNcSD9TglTyWSKAC32QSA0jwj4oRQASUVGIVKEnAe2/bAQUsghUQQI2STiAkA6/5ZAPSkg7o+WQG6hxYIs1AUgFTMiOQKmCLMAA1MCZaAiFnfSgWgFCsACyAjLc+JDMgZK4P4QzgvgGIpoDgrg/xFEj3BmJ2oJ4CJey8yAU7kOwMqGBnoAx2XoM62LmL5uOaex8sHjjcO3n5yORdBMNDn3Wa5sLwVsHYqK9XuzkgFWOLGl+8at76u71VvA/OO70XFcJ1AJHUlc7TtSNUSNkPZY05BIo687gP9TzHCu9/Hf3yAf4DoGnbxnZxd2gPHRE4Pp45Wi7un5+diMBpBM7mazXe0oDzw3EH7fjZgQYMY40f86UavxxJwB9dw7KOVweOBLrLWONmvlLj144E9I5VdOJIQHeJrYV6TAutAK4ueeF3GjDvkq4/vTf1zxxvLJvaBVxmXTL8+sFus/Yae3bYCtyvk+94m7Rlfxmaec/SpimiZ2mA/tWHzTga8O1ZNKB71jKb7w4cC3iPVSzgmmyNa6wiAedkc45VJNA6WvRsbdENwMkx2XR/NUTguamv1sl2uzx65LD75N/lL2sO0mhywA3RAAAAAElFTkSuQmCC", Ae = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAQAAADtcJt4AAAC30lEQVR42u2b63HiMBSFj5gUoO3AVBCngoUK4g7iVLCUQCpwOnBSgUkF0AGmAjsV2B2c/bcLwQ/JtmR5RodfMANzP0u6ui8EsWyt4AE8wCg93L4Vo3+QAQKEkP8+OAHiNK3RvH1z/Rrxo5IxM1Zs1pkJo+kAriyeAoAbplRRwT2lYwDc8EgdVeMhJgOgVHzy9xCRAwDcsOBwpcPXYRIAxhyr81CECQAGbp2JEEYDTGT+YISRANxxSp0tAzDi1EotAjBovWvHKLIHcKQJVXon4dpirWiUETZGQkqJZOhXBTWiURYIjMXFa1EOiUYfdK4ug+YDBYESJUpckKsH4BorYPT5/1SNAz7bMAblAwxpX+dm/zTsEL/MkC+GyHhkoOySOleg4FyqGLfbrHgGGKCYNXf/EK/NZ2ClvJjzKm4LOJYCAMRMxgA8OlAC2jX5pJViCBHCBTWkoavetH3PCpnFK0wzZur0QoyQQsItrUWp6IWYIHPOfOCP4gowRexkNbcWvxRWwFnzAclN7yFm7Kz5ANAHwBH5kRU99q1A4uDRvXWmXYd49rCtXyXWXSsQwXUF3VvoGYvS/RZyv3Gc46l1BRgu4KHXXVtILgCgXHqf+LJ0gNOyAUqRdwHkzgN89rnRwpHsa3BCc3La/PefNex7gC+nb4C33qReHFA6C/AqapWqxJuj5n+Ig2J/gEdDraRR3l9sm2qjzQAShWNBRY7t/+3Tm9SLGlvUTm2eJ1Fr9gcY8kwX1DCao9gnpmQyu/lJUwdZo9HNkNlMphfctzWXNDs0lIjwG4Elz5SjxAUHkav1ibUa3a6IfnLXA3gAD+ABZgNgYnhqomKmNYBGvZm5nZUwIjU0MwdbHfvA3Ba62C/fTrqFACZGJkev1XsGBswL+WDO3wMewAN4AKj8FVFp/OzFcNXuS7ybi4UiO9Ugc7HQs6WRY2Nn4HvhsRClhYpp0Tcv0BELeTfqATyAB7CsvzDQNBIBkfr3AAAAAElFTkSuQmCC", me = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAllBMVEX///8AAACysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrI2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOv///////////////////////////////////////////////////////////+ysrI2yOv///8aefcrAAAAL3RSTlMAAEBQgHAgMI/P768Q379gnzCvv4+AUEBwEO8gYN/Pn1CAEDAgYO/Pj69Av3Dfn49ZNXgAAAMrSURBVGje7ZjXdqMwEIZDr67EcWInG7pN86D3f7kVTrGRhAEhLvac/X2nI+abJjHm6elLUp9kRW2kybo0UE8tPdxqmBbcZDuaLhLgagugtFREAVzVBqYWshCAvIBOOe5kgGvCI9nKRIBrQY9WkwDGAnq1ngAwbBggjRvQn5++LPUABtoH2+ADqDBUlssDMGC4TB6ANQIA+njAaox9WI4HLGCkrKW50ocDFOCS1b7GHwAc4NVaHwJwgV+2OgCwgimy9F6AOQnwe7a7ARYIIXQDAIQQOgH6ZMDX/dQF0M3pgOv9xAbISxAinQ1wHRCkNRNgLECYdAZg2Ft4oDQaINQ+vsMpgAVCRQFUsfZBJgA6zAwwRQNUAmDPDJBhZoAqHKC1AWuYuchL4QBjboA0M8CZG7CSZu4ilwAogu1TLxxXMIB+ZTpijzH90heaI+bYIrCP2IOXIQ6gsEdHTdwR6JhN1wLzw57sRMRw+8jDmuzkqZPX/Wcq9my6moJwlCF/Ag3V4ZiQbPw/1uX+6sin/4B/AbDZes/kkuftiKUXb7vnBHh1Xb+2Vt4OeKlt7ohX6iMX4L151GstPTdLO8qLes8F+KjJCDY1ZW1fc0ewa578eKO8bcf0p1n65KnBNd31e6ucV283VBoPbzyAV9rbD9pbjy7KUMALle4dw9ttk0bOc+ARrh0PVNFx2Q/1YcN70I7t3vismd7uuU6yH4SUIbpFo5j7qkAoILdvqaInKBUJ8KgDFSDEA/DRKcKAJDyjjOyh29UXZDmOAEnhOYtHArBfKChQWSFUta+m3ft9iOjsoyqvGLH2AMIL+laVd4dfpgil+IfQKR5dg/iKqJL7zZeMaKswSOldAwFJ1Tya3ndqjhAZzteuSzwaEFU/KUrL75VQiq+A/Ib0f3ddwvFFPmGH/eynyCVKc1zUPDqh4r7IRYKKpiPKsREUQfO8L/lF8g3AHYNQ1tj83ZXh8HzcptEpjSYftKRiZ4PzoF2VooQwhRNG1rOccFXEOdW2jJYscyGDl9/YJmsgcrLDls8hvpxwF6WzAKIgl6Jr1fN4ttk0f3CnCQGERRFNBMymvwA2w4O84CjhAAAAAElFTkSuQmCC", ye = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAY1BMVEX///8AAAD61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH////////////////////////////////////////////////////////61jH///9qVy9SAAAAH3RSTlMAADCvv58QIO/PgFBAcI9g3zDf76/Pv4CfEEBwIGCPRz2z4AAAAhFJREFUaN7tl92CQzAUhFsiIWipbbWqe/r+T7n9WSUkcXDszWZuMZ9IZhKbzZ9oi5Tns4Aj750DECEARCsCJDwVrwdgL4B0AAf4B4BEymQ6gKdSChQgfpoEWhPfDODR40rIMYD3awbmqvBM/gApHqAl8NB04e2vDM4ICMBMEDuWWvxxI3h1snkebP4Rag623kSC3t+Wg2kEg781aB9CjE7fwN+e5IbAEAMw+I9UxS8BARAG/7EuehO665rvdyx7WjEZd90yvf9o2XmPB/1OQfnQVZAoNzI+p007DyUM+mJtY3hL65rvQCdJtR+ICPRinATwCcVQEScAWPztBCSAR2CTvxjgg13pQkAy4g+hWAbIxgDmxkUB9jAusQTAEIBgAUAg/CFcAMB8IeOu1APwpBXHrtFeJ4nWwusDlLyGTRdHKECzK+3UnlIB6nJsjoAo/+a3s/c9AwXg9Z5JpgCge65sh6AA+NqAz3lRGfQ0gFBrN+6tIslaST4JkDXFHnQ8YlQOskmraEbQcDnw5wNSFCBduYtMdYpq0wifM5Lf2ElygDmA/HAnU5FrAF93Qh01gBMl4K4BlJT+Z90klycylReXAwdwgAEgr8ikBZwpa+4yBOSkNXcdAipSQKn5REdC/6LWAC7Xkky1C5oDOIANUNGl7aYD3CgL6Xvto2OxNuCgAVQFIeCmm+Sabt+stxsnpH4A8S9Af6BgjS8AAAAASUVORK5CYII=", we = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAZlBMVEX///8AAAD///////////////////////////////////////////////////////////82yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOv///82yOvBYtReAAAAIHRSTlMAACBAcIAQYK/vz49Qn9+/MFC/MK+Aj58Q799AcCDPYP3Bv8sAAALHSURBVGje7ZjrkqMgEIUnGjEoeE3UxGRs3/8l15jKxDaIIJ3ara05/6hh+oPu5oD5+vpftFuT5++Du3x/ZygLAAsPHF6KYkEK8CW8KQkYFcBPQSm+ijACMAmL4sId4HPQSTJHQAgripgTQAK4EFYBBvG1hDXAHowUbQUIMJTcBvC4KQDEJkBqHB842wAQYCG5AZDYAMCzBoRgqSSVe98CkMAWcekbAjLYqkQYAWLYrtQzACQOAODhKsADN8k1gAASwjIgcAVArAccnAGjPy0CROIOuPuTGsACDhSSCwBBE370JxUgBjLFKoCkiw9cAaCMD+C/AULS+BDMAR6nBRzmANoEDbY6A3jE8SGZAfbUAJgB0k8DyONHGJCRA2ZF9skB8tOA/acB2YcByczsGDUgmLtpQgx4u3CIrSh+uzIFaXzVpU+aI9WzhXILUvnworO7VP10ZFRXWsoW3qYZp8uP+umYRQT9I3QfIMz55RWzlU+ozOXAJYFn8BHIQpluKEZ0CLLNvzpu0y/g3wfkRVG+RuWxOE3+WBV1M516LK0BZd/351eQyzDMf0anYVTjqdaAYvivvn2OrvfRzxZu52FU4Km2gLyf7qA5I9yxn+5gnHqxBVzQkqt+uuR2hN+e8HFqbgk4oVXd7qP+GXH3jeAnBDcEjEl+rWpMcvUcdRg+Ti0tAbUiJbgeOZpaW56DFqdkTPJVnRIMNwXglKjqUaJ6XC1Pcqdr0QKlpFtoUS2gwSlZr0drCRhT8j31gXk91ltUB7gpUlIhy1g6H4aA0QeOOsvA5+Nkade4RR/16HSW0VgCFD7wvdCiGG4IePRdo6lHjepRWN5ojyR3qEWPRhZuCFD4wJJlVIsmpAPgVdWoHi0+tehSsAK8VlWhLmlxSrQtugjoJhUeanzpzzk6IZOUXCftZdFFDa5ai7q8RPfKrbV5F/3q7+kPRkDwNyf0EugAAAAASUVORK5CYII=", be = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAQAAADtcJt4AAAEzElEQVR42u1c7XGjSBRsuTYAQsARLI7gcAIsjmBRBKuLYHEE8kaAFIHkSQA5AskRQAYog74fQhjECGZgkOBqn8uuEm7Jr5n30fOG8oyYtj1M3H98q76c9f5AYcOGA6u4sAO8nVmny1EzoyECwoKPH3BLrpftgB0+vO1ICQgXPxEoAFOs8eYdR0VAuPgNV+MNR/zpS8IYAWFhqXTn6yTmfcLJEAHhYnMl4lVshX+7roMRAiJA1DOUD3juRoH9+4CIersPOIiFhXs0MhF1ivxBKHQgIBaG3M8p3JiA8LE02lYd0SsYNZNY2NjDgml70SuqfZI4GsB9IOqeCQ+a4eNiCLO6h6VWCIkE9mC6+NFLB25kBlpXu9hLkeITh2YB3pXAkPe/rpa2WF+j0YmAcLC/+XbrgFdZfepWhX7eYb/oYCNiYZupQv6dNr0u9iLoXYWEjeSue/eVN+8XQs6dhw/BNcExFQJAIJZ9CHwfwQhoIfyOBIQ/ghW4opm+tW7bF/g1iIDrqpnmGlVI+AOpz56aSbEKiWWvqcNQ9ksxB0SEBcZogRIBY9v2AfJAuK0ERDBa90/iopmAsAxv203b97YVWI4wdavFtImAsEcdPgCq26qH0chmYwR+ANM+5HNH7/OhgYBwJnDTj00rYE2AQDr1c+LPqRPYTZtA6jUlcTXDR2nrxjLqHaspMkJbtfWB3ajdf7ucYdcJvI+6A7y2dmJvO+IgmtfPlWVV6HWs0S+bVEunEiIeoSLaec9Qno2+4IixCbgX6EynhYN4RLqoMptWmk57BzyPpKkd8eLNOxxweAc84+3+dR+PzYfgLQccwsHvO20yU6yxkh+9ah7yCQs+/rl4FnHIdE3xia13uPFTi7c0/p8efP1L4C+B2xOgT1Jh/MuQ5MIc7mpGl7+U3hGTTBRxsTmc3GeNFaDLBS0AH+fZDAMGElztqgIuBWhxQXfAFSBJ7ukwJBnTYkzWF58uSTKmzZhkSId7krx07SrO0fNZh8DpD5B7kgmz/NWlY3b+m4wJyX3xym7BMX9lDUYAYMCEZYsu3QIAWgwLejq4jCEt3ajRTGLaJQpBY6X6cs1VwmV0uoS9TgjZjFi1WOYc3Tw72lZAEWeOwDlmTzmQXMkBJ7+eVHKAtRyQ47Rz4EHzcG2HJ7wDSPGUb3ds6YD+DU9IARzxiK10cF/FveMJOwCWtmTXCiEXALgkmeV3URK356tfDUoZ5w4aQpXOyQl24sL+4Hg5YpXaR/6tglsPqoXoKC6tq1jHFXGGQojBOeZbPnZBcm8OZy6EbMXDPwtqDwdakto1xH6APjd0y6c2DLmp15PK1QNAi0tu6kHHsHT1hIsY9QumxhzI++SS/kkl5oIrlKrUjItcpbp5i2vDnUVEMFgOMChUytfPRLICyxIuK/prfQU2Ety+ywooJ/GF+kmu3S3ahXPNuKr6Sbrcfc0qRLdQ6o1Si0FJfariQtqDEqBTU4tkXF9y+he7hBOJzjhzBJJ8oUOSLJIuqm1LztG8IRnn6PpW076CGzCJY5JLWqdkzsteRl8iszOG+XiE+crJkj1jxkWOiwucPXwnDmV6/hpOcQ6U3bITo+uzPAZw0PyvBpCfkhyRzlK0PwRwVDqWWgHYmiIwI6Zt/wEvVHG9+kZ6QgAAAABJRU5ErkJggg==", ve = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAQAAADtcJt4AAADyElEQVR42u1b7XWbQBCcy0sBdBBSgc8VGFVgUkFUgtKBXAElKK5A7gBcAagCSAWog8kPybI+4OCOPSQ9s37SH+udbrj9mNlbKeK+7RsmABOArw0AbP0T/6aaifxORwPAiGQuD2A8F4oAaAb3GwMPBxh3CiAGADzdaRBzwZ3V7k50tSBmwCU/LWckCUC1b1QJZB5EeGrw+woZNshUYQdgZBdizS5b3HYa/YvK8N8tMhQ3H8QMGHN1dhYp59R3VYkZMD9sf36XVILRfvvr++VC5bDn7ymIGXLOea/ilB29t61Vs2Q4WhAz4uqjOPWsxbXxE0tzam3e5XfXJ4/VUYHS1J1Fqdi/uiwY4QROqMHOgl5nYCQRTM1hLhTEDI9S4oetBMM89wqAupEgaJFasTePADhvZDSlaKVgm6MNTqOM0ewqb2KSc2fPXoK4xXkGFqeLCDCc6CAXYmAgx1pQsRmSwjAAeTupF1ZsH4xVCwJo+AKREGbExQXZPhafCePPCuMsKalhogqZmjkJzQB9Xa9CgU2rPOo+gX2FbLPUg9RsstoxjTIWb0ZVkot1k7kE0jaDRoQHaPShzlsUeEfVSsTNLnRUH8Vc6EwxJy0uVTJhfKwOnLIQ1z4BGLLcQqQOMOwRXCkgXsiWQoXsbFlPheyiVJZyZO65nyeLIHh1JIfGE+hnImmWWpxO996YCIBPTa0yCF1wRFZ3L8MtO4h/IQA/eq4RC0VB5VKnTQBCy+ujofYPALC5BoDfIgCKPXWQ6gtZccVQpC+RmlqL1oXMCsAauM5MgUHQWDaoZ3bpzwVAY/oVA1Cox2sAkLsj00yAm5pWcZB989uKgRr2BepRFbfjQi5bSWWonUwh2zqsFyD160g2ADaOa664kp8LcgHg7s1z5KOdgyELBRxmKWP/OzUrspxDreSiH09iwAVTrtt73d5EfQ/Lz3s8JxuPuDxqX64F54UYooR0W/FUsOiLWtPaLKZ9a1FVzIQ7o2Gnyqhkh/5eRuc2r6IAVIZs1O1ntqS8m42OewYv4nOjKhO6RvXy/NHriilEjnGowU9VeRA0qsKfcdxHVfA19HeYDPJnqefBV+bQHp9+gZna+tXEM3jTWtjil9rC99zoyfCkpNX9hhUkxm2CjjtjN6IXjDp2yUR0+xbaTWxulLHjXful68RXGnxlIHAO1rpZeHKX4YDasHLpZnsYPWbYes/eLjET11a8t19wMMYTos4yl+Edb0P6dnQlcxZzQDu99XCgfltsABSoJBqO9u11TD8GnQBMACYAE4AJwATAs/0HBto1FnkbuewAAAAASUVORK5CYII=", xe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAQAAADtcJt4AAADy0lEQVR42u2b63HiShBGz1AEMDcDEYFFBMgJaEUECxHYjsA4ApYI0EYAOwkgIkAbAdoIVhvB3B88bB5CD4QeVdO/XGWJ6jPd0/31DAhNu62DATAABsAAGAAD0GLrgqjdCW3jMQDgp/BzvQl1Swk90lv9aX9zvl0vgHb0Rp9ZiwD0RF/atiUAWuq5vmaTVgBoeZk6e5PtAFgluL/I/Ul1ACQkj9Zaj1oAoEeJ7hdwpXIAbem/if6vigBULSWmJG/TsPFaSDt4N/79r/li7uUhYq6IKYmDzQCQ2MSEQMgfAjdMzv+b618dgBrx7cwViQM4ACpiycyNrryY5v5TEQChc8lpNeGFLN3S5+McQm+wb74Tin7+KpQDQHlMsXJ8+g8+3PhTPpAulXsielAZVVLNWeRyH17ZqM81tzO84T0ohZTFIpMD12zs+gcJQZpUiETvARFQNpvC7sNc7d0WY4KUZ628cjpDBJTNCsl9to+CttikfFbMswhLjICSzO92H+bKAxARs5QnJSttlxgBtSip+cT0d2VVS2wsnnAS0zJmKIJSyqh6ZVpaywzc54vOPOJ7QmXz+UguqdrmBQcYEt4AUJJtCelzpR6dzge8J0L8IhDxhRz5foxdwPMtgPSylzeNhsTXtJK+1d8jImDNALAuUEUigMrSOQunEyG/3OBkZYt0mohechUa8ThzeGWltmqi9usuItHHLwBwo4y+8GizeGerjq1LjHMjrBPLqLLZVDbmhIwPO0Pn23d9wk5ikKszm5XyjlFYZt9JIkxOoUGlo6ZkcVBMjMkqqT9uzcQ2Vdt0J71FzDjT88tdt+4kbrCqTbLY1SQRZEijI2bnUvuridpSh1m87/96S312eOjQZ1Uo88z7KOvtJd/qZhkZHy6iTuS0stSG91rd5xiDWRb3TyJQyuBSgl5y/9uvrc7i/jECSjbCfZDKOeqla9Khf36LeUihRSPc/9pC11eOafqX42Z3f9bm0BR7+hRqWQac7snWaYLJM4CIn/jJ01kXlFdD28oy/vzgN0HaWV23ct2T9bQhzHbh0alYefKIb6vY5us2ZVrUdoDfbQdY5geIG+R+6BZIobBBALMim3jdoA28LALgNwbgy51aDgA3Sr05qcYC1y/aB94akT7Dwo3MDXdnLLVKt6Eb33XRXfphej73n91CtfDLUO+Oa9vMAT23cCk/OVZRr5WfSsS8uXcs3MUdmZJM8SqCiJjhu3fpgKuXfEriMcB62JwQEbFm6ZagADTC/AzLABgAA2AADIABMAAGwAAYAANgAAxAMfsf1kr4pAGVbAEAAAAASUVORK5CYII=", _e = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAllBMVEX///8AAAD///////////////////////////////////////////////+ysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrL///////////+ysrKysrI2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOv///+ysrI2yOuOljqvAAAAL3RSTlMAABBgr+/PIIBQn49wQEBwn7/Pr4BQEO9gMN/fML+PICCAEI+vYO8wz5+/QFDfcOWI4ngAAANOSURBVGje7ZjZdqowFIYLKDgyqASljjhVqSW8/8sdSOwxwSQEEi7OWue/hf5fd/YU/PjoXIaiTKvXzzLb4TxWBZiDwr3UoBvA8GnfEcAcZX817ABg2i//vqEfQPpnY/0Ayj9z9AN6pL9taAdMSH9uDbUHOH0KMNUOGFH+maEb4GQdA0Z6AK7nBwGEs2C+CAFVopkGgOtHkNR8+XpmVQFmY8ByBt8ULQCrB9pU0SqATMUhBzBuBvAgVz54HxOFPpsAgA8FmmHCZ4VgyQPADMJ6wroagikLqPP/JUwqhJEswIe1mqEXp9Z4I0GoAjwooe3rRkEwetVTMoeWWQWsoJRcYiq9pkZ/QCKcUTFwN1VAIAeIyb9Zk1FMcMtNJ89CrgBCKCl/sXQBZ/nQLU4DAthEsR/+BtHnAegIXNhU8XMCOjbbv08DfNhcMU64yY6hRwMi2EZbwSlZFGAF2ykAzB1RnhDdBx5sS2DPcHSbIQHbtgDosy4CKAASUD/m+EL1Oq4ChuQs2vlRe38YAUYII3LYLVTsCy3es2AT0xQEUFHxWyHZ5gugcvpkFsjr0sYk9oGv7o/bzX6/bpeAUIM/XnO/u2GzpjZarAMAS7cBPn2LXplLLf4Q4Cx/jtfVnTzTAyinqjM135c+gPoAzFuFqwmw4wE8TQDuxWuhxz/uGjDvGuBxAWGnOS4Aq05PqGy0uMMuQIBtlwGUgJ26fwSE32jb7g4IA5QX2tKo+dJfRZ35P5f+SqGSYteoBxhg3noXA0MGUHwbtEFE/q7uhx/i6rjz5o2yHWxDiV+W1H8c/w/49wD7w2HPezk5ns6qgP0lz/Mr5+Wv4tlBEXDL+SaH8tldDZDmfEBy0QC4IwA7CSi4/FsJcEYeR+ab17xNADQgeZQel4T5Jg7uqgRAWcx/mC9+o2c3pT7YI48HO8Oi4GQBOIsp870fQXlJA1AZnqimTqkMEMElB8mmJgEnukRR3adketIWTU0Cro/8QvxbRzKg5JZfDpV6fqhN072gbHBTf6kB7oKU43o+KwFSQQA4uC+1hSOq+5MgOFmAqO7TJk3NAeAsPvh7J7/slQBHwWg+N2pqDuAuGM2ohB6JGuAmGM0/0iUqysGdauq38ztKD7s/kZihALjsjbMAAAAASUVORK5CYII=", ke = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABaCAMAAABqm0NPAAAAZlBMVEX///8AAAD61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH////////////////////////////////////////////////////////////61jH///9N1mSZAAAAIHRSTlMAACBAMI+/EIBwYFDPn++v3xBAYJ+/zyDfrzDvj1BwgKFN0ywAAALpSURBVGje7ZrplqIwEIUbQUBkMQRkiUvq/V+yRUQDJGQh45yZw/1Jc/J1oOpWpfDnZ9O/J2e1dq6ncpsV2J5S6gffgbm0U/gdWPiE+Rtsg/2/MPfgacF20TEwhcWPNRMNWPS4nHpmsMNz0YS7pvi6bwbzqWDVbsfpjs+i1AyWUBEtCkMhKzWDeVRIcxwRizVorQCJ1GncW/VC/73EQanqTP8tzaQeaLHkvoz7CHQdJJq9dY3A1barnpYxYRNm/umRTv6ecYs999Xqe+PIFoLwRBkl7nCdazYGRryLomELYUonyl75Fhw5NrrG9XcxnSuN1rk+yhE3x1PKVWIIQ7goode5wJUSa4G2BMsLGOuMVViU7rVheQlz1Zh1eqGOejDUAF9ly9Q2kU6BDiwnIBLBsqco7MX5MAxLuoyslqs0UIYtswCKT+chUqQKk7FetMUQyRRhV5ALSx+kGqwiCjDSxaQb7n1hnAyW7LkveTxYCSo6fyrMaSHVAuZZ+8EMdgU13ZgewBcG/+gvyQxWK8LIPc/fZunGAtg41acwDDoiDUZsC74Mi6ewEnRV9PtzUx4sGV2awCow0AVxDKyPxiBja8EEdjOBQd2OGuanPHmeNWAmPGphRb3eBEZgDS2TVOsJDIyVd28oXS6fYxg2hxHEJsBJWs/wGVaoYLd2lMDaGtap+uSVL+lBMKxV8Q7/+ZF3DFvPAujeWrrQXA0wGyy4vmw+Wm5SK2IDdunjMZK034UNFpSdi6RHycGissJ6Vu/dcGQ6hIIj08UODJjTVCo8DNbWYZnwmIsssYjKAT63BCtVRhO2YI3K0MUW7KYyTrIFa1UGZa0dVi2dPD1D3w7szp88nSawxkrgI+k49wnDtsNjoD18JA6mRlxbTbKPgvFHvB52/QMPUVw819YY0mp8hkTnL7DePQhas7cSOY7eB9abaWtAbqozQ6ZJrYw2V9+RYwDrJn6NVhKQ8p7rTEO3nwRs2rRp01/XL+if2SBNnhRiAAAAAElFTkSuQmCC", Ce = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAZlBMVEX///8AAAD///////////////////////////////////////////////////////////82yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOs2yOv///82yOvBYtReAAAAIHRSTlMAACBAcIBQEGCv78+P37+fMBCfv4CvUDBwIM9gQO+P315uOm8AAAKqSURBVGje7ZjdsqowDIW3IC1WoCgogqjh/V9yC/sItrTQn3hxZlx3Gcd8JUlXCz8/Xxlqs6Yg3Ea9SLgxlAWAxjsGk/YJQQWEO5gpjSgWIMxAKbaKMAJQDlox4g8IGSyJU09ADCvaUy8AB/AhrAIM8i8S1gBbAD/CCoCAobgbIGCmACBOgMw4PzDqACBgIe4ASG0AEFgDYrBUmvEotACk4CLGQ0NADq5KiREgAXdlgQEg9QAAi1cBAfiJrwEIoBD0gMgXAMkyYOcNGPxJCyCpP6D3JzWARgwwxDUAgpN+8CcVIAE0JSoAx8sPTAHAzA8QzgAxan6IZEDAcAE7GYBboKetSoAAOT+kEmCLDQAJkH0agJ5/LwJydIDU5BAdwD8N2H4akH8YkEpmR7EBkeymKTJgduAgW1EyOzIJan7VoY9aI9W1BfMRuPLihWd3mfrqSLGOtIxq7qY5w6uP+uqY7xHmhyy9gFDvm1dCV16hcp8NJ35o092uacwzh2bsd1Hu/NXRTV/AfwA4HIvjYQrL4vQWnYviPEXVqSjtAaeu66a/XZ7Racr4jLp6DJtndLUFtH2OYnycWx+OPxZ91L6iayesxRDQCP+6d+9PcO6j20GA2z5BX5Lu8cpRd0JNHnN4Y9kDaVVDSe5jvwf4RoC3loC70IFWUZKzAD9ajqm0qqEkl1d0VMBrS4C4qotQkiFjV6n7YQgQV/VXknapHwdLQLkwopulfpgCru+rqsQRHWqi6Yd5D8pbUwkleSty1dzugmVM/XByU3HXqobh7mfXD6UPvJmQDm4IKNU+8NdhcX84AaQRVcAffifaURxRcbsvwQ0Blc4HXieSDm4KKHQ+MFpG7QfQ+sBsu3sANCM6WKBuRI0BV6XT/xuwpru1/veieiFFbXEv+kqrXxjs4T6OaweFAAAAAElFTkSuQmCC", Se = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAQAAADtcJt4AAAEm0lEQVR42u2b3XWrOhCFR2fdArgd4A58OsAd+HRAOiAVXG4FTgekA0qQO8AdkA5EB/s8mGCBRkIYgclaKC9OYgt9MD97NLIA/ezxi3aAHWAH2AF2gDkDIz+z5o5wgUS25AqXBahwH5cfCYAjvodaDmBJH4iYV7sT7wBOmz96xqYE8ebCKAoAQI20+0vSOTG0xedQAIDzpqIQ4sdiIZHwAEjbxQOA3BbAEf1RIO4DIOmywhYBiCAxHKXl9X1kLwZAjER3WkTI4TtUf/lIkCBaFaAzj3wAVXosP+8vtjWtal2A0iYSkDDGpJtSbLkV1ri0jJSIbCJBXMWJ3uiL+cyVTuKP+LLOedxMJhaf9Jv+p0b70xe9iZO4hr/WP8skeNFQjhuV3e+HF0oJpKhQDV3PYzQz9EGMAgrSQ5yMObHmZEqTCXIoEhyRyvdduVbHfY96vhMnmuMWqJAsXOJmVNMjS8Rj1/s10RCOJM1QGGzxCWq6DCJbM9eEooGG+TanKcZReb1LMde5BEhkmgRmhlP3ewg33VMGo76ntiCZGHGr9ycAEM0AUA+REkxKWERC4ZBhowCGyGbmDKqFkKJ23S0LQGGJ9Zz0M2J/QIBehB7aa+IAYACt4lvLNqFNKLW78j1iDI2pM4/cqN8q50y9bBPGiTn7V2PPoftMPlr4KMYP4mAAjOHUOBOx4bV8PAcTAAnjQxUS9vm2ddv8PHCx11SImPCqvkuTDiCxepBWXLL/P4cAGKupuBxRIuoDMPdemQoX8cBUZQiAyh1rLBAKaWftZ+a/VnmOs4ZahAA4Q5k7CZ4Qliw7Vlu03iURrdwfsEsO/8W/vMFhhXhi8S/r0CA2UlWJ6Me0mCyyTz5Xza0MMLKx9QREiIKmgHyk9qcXPwECRxSQ9ww+H6AYk82WxVedXM4Nj3BA9DJyHgJAmWWex53PNcmcs/KZhUDWu16QTCyNC8cji2/f0d3JvDUL6S5fmPosSCY+MgoyR2SVcplDjWascI4s9VmoTMxq+BoXZjH9p8PVAzFbWRTM/GnQMOrRvDDUUrfU0pBryr8JErIm5soRq8zWACQTaUrfmcLuSvD7dDXfXelw5YQtFWnUCAGfAOeCDpntsS+UsjOmCwBYzSfy2JmrJ+/MafsSIaJQbJcIXluLeGpvtPWF+XnA2f9dEAAA0tkAzAUUMq8OTTwRQLIeEYfr0NzHBx3Eh5cOjp/obh7oY9os4wDX3uuDeBczmnfj3U3xTr+1azZ0mwkgrvTZdnpP4uRoU4eDuIkT/Wlb5eO3yysKGWexFulSSqOoiQIdNRA3cZte1tN/PeDjE0+iedFRA0S4UN1z/4QqVy9n9TNzLhNiBYe1KNXOel3WPG6T8c0jp161CL9O0iXrntjKIPs7bS7B4SwkI+TIHUX+Smfm0pFihxEJ2zr0p4xK96xrVqN5obYGYJjIMA8MTWxrANXQSdmTuw8nL8MAhDuxdaKMiL7E54gwOSClmBr63PxXUPykxJa/AEH79wdeDNCsASDGzFPMsV7VHh9rxL9zfOB1JvRODRE19PbCJ7A78Q6wA+wAO8AOsOXxF/pC6rWuv391AAAAAElFTkSuQmCC", Be = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAflBMVEX///8AAAD19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH////////////////////////////////19fX61jH////8w8X8AAAAJ3RSTlMAABBAIO9wYJ+Pv88wUICvII+/gBBgQO/Pn6/fUDBwYN/vgEC/rzDXSywmAAACUUlEQVRo3u3Z23aqMBAGYEFttUUbIJyR7ta2TN//BascItgkzkjSm81/oUuE+SAhg2u5WFiPQ4m7XJH2pwLLdV0/WAQe63M21oC2PkkgAX19ikABtvUlT655YFMP8+yaBsb10QIWcNv668ErTkAC7nN72l7zums/rT1jQF//cdm87b01WkABor7TAQ5ewACX+gLACxjgQdR39u0icITwYgLYi/oDoBOeTAArUX8INI213hmZZG+z2Tm/AMfbvuxMt+sRYON5MAMzMAN/ABj64cX8IOTqvtc1vl+JfD9GASwBgJQrL2Err5+djoIYA4TnPVXCSvXruqkPOR5QCY6uPgQYIAa60NUHHzXJGVlQHyG/TamCZn/FOshJgu58FABPQTFpkoS6s1GtZCEggEJ3tcpW0QtoQDGa6l7UCsMhYlEWtOOWRWyw3dfNlqbZ8dPc5ZfDygCGCaLLjn4CGZ/YTeMUrlOU5to190GWnBsCWAryFAcjwCEBVZKDAYCp6yOE2wBPQZeETwV80CefCMRwK+U0ILgJFJOA2xcAEE0BAgRQTAAYYHK4H4hQQIgCeBz2Kdn1w1Af0dNZKWrE/AoY94OKMAWnxSa73m6NCyCQDivg0vWs8cZ0DMiHlQSEsq0CSKT3NgmIZAMngPG3/ROWBDjjtlhd3UVxFohUfYukAbzKRYksRq0D2l10x0IjrgNbK7m6H+AogE3opvnEESL/QUHODOCA13/fdvL23gDHb3t5PQPvFoEP28DnGfiyCBybSf76fLN0/kdnMWfOnDn/R34A3oRXT7I1m+gAAAAASUVORK5CYII=", Oe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAflBMVEX///8AAAD19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX61jH61jH61jH61jH61jH19fX61jH61jH61jH61jH61jH61jH61jH61jH61jH61jH////////////////////////////////19fX61jH///8yVW6VAAAAJ3RSTlMAACBAYHCA7zCvEM9Q358gj7+AEI9gQO/Pn69Q3zBwYN/vgEC/rzCDifxtAAACVklEQVRo3u2ZfXOjIBDGIzHGS+7iCxU1b702baXf/ws2CmL0ABeF6XTO549kNPD8ZJddnMlq5VyeidAaGY03BfhVVW0cAlBVa+0OsGkAgTtAsAAWwAL4sQAUBEgCQJsAWQGg7d3U/wcQbiF9DwJgrv4A0PhXv+wBGkIHYP52AGgrCKJdc387IRJuvrfmgO6OnW0qnpcB/B273obW6iDcM0e/+fq9B/uDC23HPNnnH7g/vJI5odM+tNwqBoT9zn4vOkzwN2t2B3N/w27aEg4zu2kUJymWDn/S+WdxTECAKKeUFlj5bqrwL++zKIEA0nqkioA2ocafHuEAFcHT+dMEAiDUnMD9aQlKcmlMUM+Qb1NTgma8og7MCLrRqkJLqCJpEqW6p1EBcMFnAQCFbrXKVtESwABFNNW9iBEeQxRlJYtcUmbRw/1Yly1Ns8P33B27aac2LTwg2QMhfxw4rZuSvn2tc2avXeOYypRgS4CooHLlFyuAS07pZAIAEKn9AYRxAC6oTjmeC4ipXslMAKFjyuYBklHAeRZgfAEjSxgDHAGA8wwAphBdpgMyECAFATBJW52i4WEI3KnRSXgQPAD0+0EK3kNNscnWy2tcAAZW/BUwBwH4sXeR5V4A5GGF+VPcO/x7WAE493+8GgHYek+ywAlAf7+0J6zRCrxCEoRuF5EyEbq2LdIoBx6+HoVFSUB1YLaLJhSaYR18byV/Ty8Cxaiw+QeFsRYADPD899ONXl4bwO3TnZ5rwKtDwJtrwHsN+HhxB7g1Sf54d4R4u3mrRYsWLfo/9AVoDlYQzJ7o0AAAAABJRU5ErkJggg==", Ee = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAMAAABwp6PBAAAAk1BMVEX///8AAACysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrI2yOs2yOs2yOs2yOv///////82yOs2yOs2yOv///82yOs2yOs2yOv///////82yOs2yOv///////////////82yOv///////////////82yOs2yOv///+ysrL///82yOuxqhjsAAAALnRSTlMAAECAn7/fz49gMBCv71AgcIC/r0DPcFBgIGAwEO/fQI/fvyBQn88Q76+An3AwLNPT7wAAAwxJREFUaN7tmGt3ojAQhsslIoQIYlu10gvuVq2tI///160Ej0huBBLO2bNn368J78Mwk8now8M/IqdDrucjNIEAoWkYOXrSBuAwhpaIP7MISHwCvCahJQD2QaJuhA5gRkAulJgC5K9/zYVrBsABdCk0AUQTACNCBwATADOCGqDxfWrNBgJiTX8gySBACtpCQwAJ0QdAOgDg9/AHgnsDXOil2EvdqBfAhwFCXqQLSGCgglAPkMJg3fdYOSAAAyHcCUjASCTqAoRgqLADMDUFXPuTFICMAfVXkgImxgAI5ACcBmBBngzgEbCiqj8JAFEAtuSJABGx5g9EALDpX5UqC8BW/WHKAZBV/0ulMoAZWBYLCGwDkjYgsu0PbhswHRsQjA2AkQH2U8BUkWvdn4wNiMcGpG0Atg5InHGrCLHt2nKrq0aXNiAFy72UBSSWTxl/6ftg9bbhATZDCLBoLvKs+U+weHS09ZGCSDL84tjOCcDy8X1qaWiUj++u6eB7/x+SePgNDa424ic6PwKTNB4AmSDPHfqv41D9B/zVgHm2eOQfeDrf9MyuLbNspQ9YlRet2f0vjf/5hVnbVE+sdAH5a7V9zgLeGv83di2rnljoAual6H3eFQEs6RMfmoA13V2wL7mVB5AX1ROva03AggLYJP+6C+A3s1aHPNdM8iPdnbG7Pxv/LbO0pjkrck3ArhTV0P7QAL6Otd6va9/CnMkAK2G+nOOZ11YZsgxAw33NFTXK1lImzJkMUL/Oz+1Ab/hDxtYqfeL7dqCXGhEUTXFcY9nK/WkE123LVixiwKYos81dcdDtJ4W/s87K4vraRatcu7ppXRwUtv/aUh2kZ/nuPPxoAkTFcVD650yBdAB2TQBcPxX6c+dBDVjdF0e7HR1OQn/assud5o2WC87DSenPnwclQNS/PpX+dcteaN7JopZdtyOZf12irR6mAtQltOSvTKm/w4esAtAUZHw7kvvTCNo5U+ZgdTnQOXdlKvyrFlBsTOaiS4qf9iMOXvve/j0Bz739ewJOx73R6Die/gCIv9WdyB7eqAAAAABJRU5ErkJggg==", $e = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABaCAQAAADtcJt4AAAEo0lEQVR42u2bz1XjOhTGf8xhP3oV4FSAqQCngjHLp02SCmaoAKhgQgUJmztLQgU4FWA6MBU8dZC3wDiyYzuxUYJzxloZ6yDfT/ffd6+UkxXHPb7RA+gB9AB6AD2AHkAPoAfw9wI4LX994mRxUfgAxNq4WK+MeJ6s9gJAFGNGqfgACQvudXIkACRkhiqZuNO3RwBAZowrJ+d64haAcyeW2xrxYSwzt99zrAHxecm9iDEoyxcAhjrqrgZ+W88RA32hh/qCAQvr/U2XNbCqsvacZwzaxaPVARNZUnRWPWEtdNjdTPxuKoarkrmH7El1FoC+YsIdFzoumYwPSCU+AWFeOaU4cjJ3fhQaqGVHa2ZUlUU+tLQz/TsYAH5bJhSVsKdRPjZJzAPz7TAa5AHx8fA5wwMgSF+b1DkNr9lfhf2TkBsrGy/0VWHdWSFXk619b9O/VmROPALOCSo+UTdiTA7qx8jFKBkz27LK8GM7GgKQkEvCdL/djWs9bSB+DsJqdx8Qj2fnor9XBNNC3ZDL38S8coaf07fPMxdNnXi8B/ETJjYPFZUTP+Z6PSseN1bU8uW2qhQ6bSRAwjJ108SmYxJASprPUYBXgJ8QsdxIcb+suFSgfjphIksrct3IvJwAVvjAn5BHa2+eiIncFOYW7P8y8QpxqdRD7vRtIyeWkBGGJQvXgmf2/5gFy0HVNywSnujBqokJ6UWuCHE/7LxQvUV3GQBPFKZLja3L7OmphhomFof1u9WZS3ak2aarrcX7VLTpzuVl8LVkrmgcsQzwMXr3MidyACAldN9TewwKyo6BhDdiku2CaUPUyNnbs9GU0PnlSqzZsZhXos90RMXOR//8axoDcELoDBFLIt2iJpaXTAOxvmiUB8TnJ6GTOlYREoIkRM0So9h1wkMjE/rj8bKfIhyIibablihmVo1mGGizasRGVYVdJ7yRkJTVrRKkRO4cr8b5UrIsCTFL4pJ1fEYFCSZVeqvSwG2ug9nCikXhp7Wcahgi/Y3/mOrrhhVZZkKGBU/6U6xIfAIudwRC3ZlCMzaq8KFtI7wCSMhlw1BsuF7XEQc8I6sFEqQa2WHvubNdvSMALCA+lxXuHvHEohinOgZgI35lZlMVLDoMgNYHHKctXFERQNahy4/le/Hv0vmdtBYlINiSnjYLlvfckexXA9vInE/Aj4ahr0gcdmrSOgcgHj+dNRYN90w/D2L1pWTOMNGLwznxuFL8GMPS6j0XiZriDK/E6BSPknIavuCE5p3OxVujS5RjQKOC0/8SXEPYbkIxD+2qqZImLcBVe0Nq6sRjzGY6bwXi0dJETSOxQxeeaq/gTGqOYjtz1YCNiwZrIxx1+JhVfqEwpYnrmmdqOmydACAfhegPhhs6iITun9R/dJwD8XdtDXb1qoG/a3O2WwCSakeVgCMwoeV6tzcEvtmPKX1zfN1pHX0e134gSmaWAT11+c5cviE25w34nqOG3c7EonjZUkPkrhp0LhNrw1Xtqda8vfgHCqM6ZlgJYfqZi8cHywM6ZsC8JI0N3Zcze2SjogjxOEexdEPLGzkx/U9QegA9gB5AD6AH0APoAfwNAP4HciO/ZgetLaYAAAAASUVORK5CYII=";
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const At = globalThis, kt = At.ShadowRoot && (At.ShadyCSS === void 0 || At.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ct = Symbol(), Dt = /* @__PURE__ */ new WeakMap();
let Yt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== Ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (kt && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = Dt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Dt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Vt = (e) => new Yt(typeof e == "string" ? e : e + "", void 0, Ct), Me = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, a, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + e[o + 1], e[0]);
  return new Yt(i, e, Ct);
}, De = (e, t) => {
  if (kt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), a = At.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = i.cssText, e.appendChild(s);
  }
}, Rt = kt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Vt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Re, defineProperty: Ie, getOwnPropertyDescriptor: Te, getOwnPropertyNames: Pe, getOwnPropertySymbols: He, getPrototypeOf: Ue } = Object, vt = globalThis, It = vt.trustedTypes, ze = It ? It.emptyScript : "", Qe = vt.reactiveElementPolyfillSupport, nt = (e, t) => e, mt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ze : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, St = (e, t) => !Re(e, t), Tt = { attribute: !0, type: String, converter: mt, reflect: !1, useDefault: !1, hasChanged: St };
Symbol.metadata ??= Symbol("metadata"), vt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let J = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Tt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), a = this.getPropertyDescriptor(t, s, i);
      a !== void 0 && Ie(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: a, set: o } = Te(this.prototype, t) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: a, set(r) {
      const n = a?.call(this);
      o?.call(this, r), this.requestUpdate(t, n, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(nt("elementProperties"))) return;
    const t = Ue(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(nt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(nt("properties"))) {
      const i = this.properties, s = [...Pe(i), ...He(i)];
      for (const a of s) this.createProperty(a, i[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, a] of i) this.elementProperties.set(s, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const a = this._$Eu(i, s);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const a of s) i.unshift(Rt(a));
    } else t !== void 0 && i.push(Rt(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return De(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, s);
    if (a !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : mt).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(a) : this.setAttribute(a, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, a = s._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const o = s.getPropertyOptions(a), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : mt;
      this._$Em = a;
      const n = r.fromAttribute(i, o.type);
      this[a] = n ?? this._$Ej?.get(a) ?? n, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, a = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (a === !1 && (o = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? St)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: a, wrapped: o }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? i ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), a === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [a, o] of this._$Ep) this[a] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, o] of s) {
        const { wrapped: r } = o, n = this[a];
        r !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, o, n);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
J.elementStyles = [], J.shadowRootOptions = { mode: "open" }, J[nt("elementProperties")] = /* @__PURE__ */ new Map(), J[nt("finalized")] = /* @__PURE__ */ new Map(), Qe?.({ ReactiveElement: J }), (vt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bt = globalThis, Pt = (e) => e, yt = Bt.trustedTypes, Ht = yt ? yt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Jt = "$lit$", U = `lit$${Math.random().toFixed(9).slice(2)}$`, Gt = "?" + U, je = `<${Gt}>`, F = document, lt = () => F.createComment(""), dt = (e) => e === null || typeof e != "object" && typeof e != "function", Ot = Array.isArray, Le = (e) => Ot(e) || typeof e?.[Symbol.iterator] == "function", _t = `[ 	
\f\r]`, at = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ut = /-->/g, zt = />/g, j = RegExp(`>|${_t}(?:([^\\s"'>=/]+)(${_t}*=${_t}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Qt = /'/g, jt = /"/g, qt = /^(?:script|style|textarea|title)$/i, Kt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), A = Kt(1), P = Kt(2), q = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), Lt = /* @__PURE__ */ new WeakMap(), N = F.createTreeWalker(F, 129);
function Wt(e, t) {
  if (!Ot(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ht !== void 0 ? Ht.createHTML(t) : t;
}
const Ne = (e, t) => {
  const i = e.length - 1, s = [];
  let a, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = at;
  for (let n = 0; n < i; n++) {
    const l = e[n];
    let d, p, h = -1, c = 0;
    for (; c < l.length && (r.lastIndex = c, p = r.exec(l), p !== null); ) c = r.lastIndex, r === at ? p[1] === "!--" ? r = Ut : p[1] !== void 0 ? r = zt : p[2] !== void 0 ? (qt.test(p[2]) && (a = RegExp("</" + p[2], "g")), r = j) : p[3] !== void 0 && (r = j) : r === j ? p[0] === ">" ? (r = a ?? at, h = -1) : p[1] === void 0 ? h = -2 : (h = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? j : p[3] === '"' ? jt : Qt) : r === jt || r === Qt ? r = j : r === Ut || r === zt ? r = at : (r = j, a = void 0);
    const u = r === j && e[n + 1].startsWith("/>") ? " " : "";
    o += r === at ? l + je : h >= 0 ? (s.push(d), l.slice(0, h) + Jt + l.slice(h) + U + u) : l + U + (h === -2 ? n : u);
  }
  return [Wt(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class ct {
  constructor({ strings: t, _$litType$: i }, s) {
    let a;
    this.parts = [];
    let o = 0, r = 0;
    const n = t.length - 1, l = this.parts, [d, p] = Ne(t, i);
    if (this.el = ct.createElement(d, s), N.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (a = N.nextNode()) !== null && l.length < n; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const h of a.getAttributeNames()) if (h.endsWith(Jt)) {
          const c = p[r++], u = a.getAttribute(h).split(U), y = /([.?@])?(.*)/.exec(c);
          l.push({ type: 1, index: o, name: y[2], strings: u, ctor: y[1] === "." ? Xe : y[1] === "?" ? Ye : y[1] === "@" ? Ve : xt }), a.removeAttribute(h);
        } else h.startsWith(U) && (l.push({ type: 6, index: o }), a.removeAttribute(h));
        if (qt.test(a.tagName)) {
          const h = a.textContent.split(U), c = h.length - 1;
          if (c > 0) {
            a.textContent = yt ? yt.emptyScript : "";
            for (let u = 0; u < c; u++) a.append(h[u], lt()), N.nextNode(), l.push({ type: 2, index: ++o });
            a.append(h[c], lt());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Gt) l.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = a.data.indexOf(U, h + 1)) !== -1; ) l.push({ type: 7, index: o }), h += U.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const s = F.createElement("template");
    return s.innerHTML = t, s;
  }
}
function K(e, t, i = e, s) {
  if (t === q) return t;
  let a = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = dt(t) ? void 0 : t._$litDirective$;
  return a?.constructor !== o && (a?._$AO?.(!1), o === void 0 ? a = void 0 : (a = new o(e), a._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = a : i._$Cl = a), a !== void 0 && (t = K(e, a._$AS(e, t.values), a, s)), t;
}
class Fe {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, a = (t?.creationScope ?? F).importNode(i, !0);
    N.currentNode = a;
    let o = N.nextNode(), r = 0, n = 0, l = s[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let d;
        l.type === 2 ? d = new pt(o, o.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (d = new Je(o, this, t)), this._$AV.push(d), l = s[++n];
      }
      r !== l?.index && (o = N.nextNode(), r++);
    }
    return N.currentNode = F, a;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class pt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, a) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = K(this, t, i), dt(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== q && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Le(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && dt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(F.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, a = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = ct.createElement(Wt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === a) this._$AH.p(i);
    else {
      const o = new Fe(a, this), r = o.u(this.options);
      o.p(i), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Lt.get(t.strings);
    return i === void 0 && Lt.set(t.strings, i = new ct(t)), i;
  }
  k(t) {
    Ot(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, a = 0;
    for (const o of t) a === i.length ? i.push(s = new pt(this.O(lt()), this.O(lt()), this, this.options)) : s = i[a], s._$AI(o), a++;
    a < i.length && (this._$AR(s && s._$AB.nextSibling, a), i.length = a);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = Pt(t).nextSibling;
      Pt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class xt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, a, o) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = i, this._$AM = a, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = m;
  }
  _$AI(t, i = this, s, a) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = K(this, t, i, 0), r = !dt(t) || t !== this._$AH && t !== q, r && (this._$AH = t);
    else {
      const n = t;
      let l, d;
      for (t = o[0], l = 0; l < o.length - 1; l++) d = K(this, n[s + l], i, l), d === q && (d = this._$AH[l]), r ||= !dt(d) || d !== this._$AH[l], d === m ? t = m : t !== m && (t += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    r && !a && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Xe extends xt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class Ye extends xt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class Ve extends xt {
  constructor(t, i, s, a, o) {
    super(t, i, s, a, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = K(this, t, i, 0) ?? m) === q) return;
    const s = this._$AH, a = t === m && s !== m || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== m && (s === m || a);
    a && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Je {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    K(this, t);
  }
}
const Ge = Bt.litHtmlPolyfillSupport;
Ge?.(ct, pt), (Bt.litHtmlVersions ??= []).push("3.3.3");
const qe = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let a = s._$litPart$;
  if (a === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = a = new pt(t.insertBefore(lt(), o), o, void 0, i ?? {});
  }
  return a._$AI(e), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et = globalThis;
class ht extends J {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = qe(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return q;
  }
}
ht._$litElement$ = !0, ht.finalized = !0, Et.litElementHydrateSupport?.({ LitElement: ht });
const Ke = Et.litElementPolyfillSupport;
Ke?.({ LitElement: ht });
(Et.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = { attribute: !0, type: String, converter: mt, reflect: !1, hasChanged: St }, ti = (e = Ze, t, i) => {
  const { kind: s, metadata: a } = i;
  let o = globalThis.litPropertyMetadata.get(a);
  if (o === void 0 && globalThis.litPropertyMetadata.set(a, o = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), s === "accessor") {
    const { name: r } = i;
    return { set(n) {
      const l = t.get.call(this);
      t.set.call(this, n), this.requestUpdate(r, l, e, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(r, void 0, e, n), n;
    } };
  }
  if (s === "setter") {
    const { name: r } = i;
    return function(n) {
      const l = this[r];
      t.call(this, n), this.requestUpdate(r, l, e, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Zt(e) {
  return (t, i) => typeof i == "object" ? ti(e, t, i) : ((s, a, o) => {
    const r = a.hasOwnProperty(o);
    return a.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(a, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function $(e) {
  return Zt({ ...e, state: !0, attribute: !1 });
}
const B = 13, O = 11, W = 0.48, Z = 0.375;
function ei(e, t) {
  return {
    north: e + (O - 1) / 2 * Z,
    south: e - (O - 1) / 2 * Z,
    west: t - (B - 1) / 2 * W,
    east: t + (B - 1) / 2 * W
  };
}
const ii = "/local/fruity-weather-card/precip-grid.json";
function te(e) {
  return e.nx === B && e.ny === O && Math.abs((e.dlon ?? 0) - W) < 1e-6 && Math.abs((e.dlat ?? 0) - Z) < 1e-6;
}
async function si(e, t) {
  try {
    const i = await fetch(`${ii}?t=${Math.floor(Date.now() / 6e4)}`);
    if (!i.ok) return;
    const s = await i.json();
    if (!te(s)) {
      console.warn(
        "fruity-weather-card: cached grid is %dx%d @ %s/%s, card expects %dx%d @ %s/%s",
        s.nx,
        s.ny,
        s.dlon,
        s.dlat,
        B,
        O,
        W,
        Z
      );
      return;
    }
    if (Math.abs(s.lat0 - e) > 0.01 || Math.abs(s.lon0 - t) > 0.01) return;
    const a = (o) => o.map((r) => Float32Array.from(r));
    return {
      fetchedAt: s.fetchedAt,
      lat0: s.lat0,
      lon0: s.lon0,
      hourly: { times: s.hourly.times, frames: a(s.hourly.frames) },
      quarter: { times: s.quarter.times, frames: a(s.quarter.frames) }
    };
  } catch {
    return;
  }
}
async function ai(e, t) {
  const i = await si(e, t);
  if (i) return i;
  const s = [], a = [];
  for (let b = 0; b < O; b++)
    for (let g = 0; g < B; g++)
      s.push((e + (b - (O - 1) / 2) * Z).toFixed(4)), a.push((t + (g - (B - 1) / 2) * W).toFixed(4));
  const o = `https://api.open-meteo.com/v1/forecast?latitude=${s.join(",")}&longitude=${a.join(",")}&hourly=precipitation&forecast_hours=13&minutely_15=precipitation&forecast_minutely_15=8&timezone=UTC`, r = oi(e, t);
  if (r) return r;
  const n = await fetch(o);
  if (!n.ok) throw new Error(`open-meteo ${n.status}`);
  const l = await n.json(), d = Array.isArray(l) ? l : [l];
  if (d.length !== B * O)
    throw new Error(`open-meteo returned ${d.length} of ${B * O} points`);
  const p = (b) => (/* @__PURE__ */ new Date(`${b}Z`)).getTime(), h = d[0].hourly.time.map(p), c = d[0].minutely_15.time.map(p), u = (b, g) => Array.from({ length: b }, (v, _) => {
    const x = new Float32Array(B * O);
    for (let k = 0; k < d.length; k++) x[k] = g(d[k], _) || 0;
    return x;
  }), y = {
    fetchedAt: Date.now(),
    lat0: e,
    lon0: t,
    hourly: {
      times: h,
      frames: u(h.length, (b, g) => b.hourly.precipitation[g])
    },
    quarter: {
      times: c,
      frames: u(c.length, (b, g) => b.minutely_15.precipitation[g])
    }
  };
  return ri(y), y;
}
const ee = "fruity-weather-card:precip-grid:v3", ie = 30 * 6e4;
function oi(e, t) {
  try {
    const i = localStorage.getItem(ee);
    if (!i) return;
    const s = JSON.parse(i);
    if (Date.now() - s.fetchedAt > ie || Math.abs(s.lat0 - e) > 1e-6 || Math.abs(s.lon0 - t) > 1e-6 || !te(s)) return;
    const a = (o) => o.map((r) => Float32Array.from(r));
    return {
      fetchedAt: s.fetchedAt,
      lat0: s.lat0,
      lon0: s.lon0,
      hourly: { times: s.hourly.times, frames: a(s.hourly.frames) },
      quarter: { times: s.quarter.times, frames: a(s.quarter.frames) }
    };
  } catch {
    return;
  }
}
function ri(e) {
  try {
    const t = (i) => i.map((s) => Array.from(s, (a) => +a.toFixed(2)));
    localStorage.setItem(ee, JSON.stringify({
      fetchedAt: e.fetchedAt,
      lat0: e.lat0,
      lon0: e.lon0,
      nx: B,
      ny: O,
      dlon: W,
      dlat: Z,
      hourly: { times: e.hourly.times, frames: t(e.hourly.frames) },
      quarter: { times: e.quarter.times, frames: t(e.quarter.frames) }
    }));
  } catch {
  }
}
const wt = (e, t) => (e + 180) / 360 * 2 ** t, bt = (e, t) => {
  const i = e * Math.PI / 180;
  return (1 - Math.asinh(Math.tan(i)) / Math.PI) / 2 * 2 ** t;
};
function ni(e, t, i, s, a) {
  return {
    z: i,
    originX: wt(t, i) * 256 - s / 2,
    originY: bt(e, i) * 256 - a / 2,
    width: s,
    height: a
  };
}
const hi = "Esri, HERE, Garmin, © OpenStreetMap contributors";
function li(e, t = "dark") {
  const i = "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas", s = t === "dark" ? "Dark" : "Light", a = e.z, o = 256, r = 2 ** a, n = [], l = Math.floor(e.originX / o), d = Math.floor(e.originY / o), p = Math.floor((e.originX + e.width) / o), h = Math.floor((e.originY + e.height) / o);
  for (let c = d; c <= h; c++)
    if (!(c < 0 || c >= r))
      for (let u = l; u <= p; u++) {
        const y = (u % r + r) % r;
        n.push({
          key: `${s}/${a}/${y}/${c}`,
          base: `${i}/World_${s}_Gray_Base/MapServer/tile/${a}/${c}/${y}`,
          ref: `${i}/World_${s}_Gray_Reference/MapServer/tile/${a}/${c}/${y}`,
          left: u * o - e.originX,
          top: c * o - e.originY,
          size: o
        });
      }
  return n;
}
const G = [
  [0, 90, 160, 245, 0],
  [0.08, 90, 160, 245, 60],
  [0.4, 56, 116, 235, 150],
  [1.2, 116, 82, 222, 190],
  [3, 200, 68, 180, 205],
  [7, 246, 158, 60, 215],
  [15, 252, 236, 150, 225]
];
function di(e, t, i) {
  let s = 0;
  for (; s < G.length - 1 && e > G[s + 1][0]; ) s++;
  const a = G[s], o = G[Math.min(s + 1, G.length - 1)], r = o[0] - a[0], n = r > 0 ? Math.min(1, Math.max(0, (e - a[0]) / r)) : 0;
  t[i] = a[1] + (o[1] - a[1]) * n, t[i + 1] = a[2] + (o[2] - a[2]) * n, t[i + 2] = a[3] + (o[3] - a[3]) * n, t[i + 3] = a[4] + (o[4] - a[4]) * n;
}
const ci = G.slice(1).map(([e, t, i, s]) => `rgb(${t},${i},${s}) ${((e / 15) ** 0.45 * 100).toFixed(0)}%`).join(", ");
function pi(e, t, i, s) {
  const a = Math.min(window.devicePixelRatio || 1, 2), o = Math.round(s.width * a), r = Math.round(s.height * a);
  (e.width !== o || e.height !== r) && (e.width = o, e.height = r);
  const n = e.getContext("2d");
  if (!n) return;
  n.clearRect(0, 0, o, r);
  const l = document.createElement("canvas");
  l.width = B, l.height = O;
  const d = l.getContext("2d");
  if (!d) return;
  const p = d.createImageData(B, O);
  for (let _ = 0; _ < O; _++)
    for (let x = 0; x < B; x++) {
      const k = (O - 1 - _) * B + x;
      di(i[k], p.data, (_ * B + x) * 4);
    }
  d.putImageData(p, 0, 0);
  const h = document.createElement("canvas");
  h.width = B * 6, h.height = O * 6;
  const c = h.getContext("2d");
  if (!c) return;
  c.imageSmoothingEnabled = !0, c.imageSmoothingQuality = "high", c.drawImage(l, 0, 0, h.width, h.height);
  const u = ei(t.lat0, t.lon0), y = (wt(u.west, s.z) * 256 - s.originX) * a, b = (wt(u.east, s.z) * 256 - s.originX) * a, g = (bt(u.north, s.z) * 256 - s.originY) * a, v = (bt(u.south, s.z) * 256 - s.originY) * a;
  n.imageSmoothingEnabled = !0, n.imageSmoothingQuality = "high", n.drawImage(h, y, g, b - y, v - g);
}
function gi(e, t, i, s) {
  for (let a = 0; a < e.length; a++) s[a] = e[a] + (t[a] - e[a]) * i;
  return s;
}
const se = "fruity-weather-card:hourly-10d:v1", ae = 60 * 60 * 1e3;
function ui(e) {
  return e === 0 ? "sunny" : e === 1 || e === 2 ? "partlycloudy" : e === 3 ? "cloudy" : e === 45 || e === 48 ? "fog" : e >= 51 && e <= 57 ? "rainy" : e >= 61 && e <= 65 ? e >= 65 ? "pouring" : "rainy" : e === 66 || e === 67 ? "snowy-rainy" : e >= 71 && e <= 77 ? "snowy" : e >= 80 && e <= 82 ? e === 82 ? "pouring" : "rainy" : e === 85 || e === 86 ? "snowy" : e === 95 ? "lightning" : e === 96 || e === 99 ? "lightning-rainy" : "cloudy";
}
function fi() {
  try {
    const e = localStorage.getItem(se);
    if (!e) return;
    const t = JSON.parse(e);
    return !t?.fetchedAt || Date.now() - t.fetchedAt > ae ? void 0 : { fetchedAt: t.fetchedAt, days: new Map(Object.entries(t.days)) };
  } catch {
    return;
  }
}
function Ai(e) {
  try {
    localStorage.setItem(
      se,
      JSON.stringify({ fetchedAt: e.fetchedAt, days: Object.fromEntries(e.days) })
    );
  } catch {
  }
}
async function mi(e, t, i = !1) {
  if (!i) {
    const h = fi();
    if (h) return h;
  }
  const s = `https://api.open-meteo.com/v1/forecast?latitude=${e.toFixed(4)}&longitude=${t.toFixed(4)}&hourly=temperature_2m,weather_code&forecast_days=10&timezone=auto`, a = await fetch(s);
  if (!a.ok) throw new Error(`open-meteo hourly ${a.status}`);
  const o = await a.json(), r = o.hourly?.time ?? [], n = o.hourly?.temperature_2m ?? [], l = o.hourly?.weather_code ?? [];
  if (!r.length) throw new Error("open-meteo hourly returned no points");
  const d = /* @__PURE__ */ new Map();
  for (let h = 0; h < r.length; h++) {
    const c = r[h], u = n[h];
    if (u == null) continue;
    const y = c.slice(0, 10), b = Number(c.slice(11, 13)), g = (/* @__PURE__ */ new Date(`${c}:00`)).getTime(), v = d.get(y) ?? [];
    v.push({ hour: b, time: g, temp: u, condition: ui(l[h] ?? 3) }), d.set(y, v);
  }
  const p = { fetchedAt: Date.now(), days: d };
  return Ai(p), p;
}
function yi(e) {
  const t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
var wi = Object.defineProperty, bi = Object.getOwnPropertyDescriptor, E = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? bi(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (a = (s ? r(t, i, a) : r(a)) || a);
  return s && a && wi(t, i, a), a;
};
const vi = Vt(ci), xi = "/local/weather-bg", _i = {
  "clear-night": "night_clear",
  cloudy: "cloudy",
  fog: "fog",
  hail: "freezing_rain",
  lightning: "thunderstorm",
  "lightning-rainy": "thunderstorm",
  partlycloudy: "partly_cloudy",
  pouring: "heavy_rain",
  rainy: "rain",
  snowy: "snow",
  "snowy-rainy": "freezing_rain",
  sunny: "clear",
  windy: "windy",
  "windy-variant": "windy",
  exceptional: "haze"
}, Nt = {
  sunny: "night_clear",
  partlycloudy: "night_cloudy",
  cloudy: "night_cloudy",
  rainy: "night_drizzle"
}, ki = { sunrise: "sunrise", sunset: "sunset" }, Ci = [
  ["N", 48, 13, 0],
  ["E", 83, 48, 90],
  ["S", 48, 83, 180],
  ["W", 13, 48, 270]
];
function ot(e, t) {
  return e ? t && Nt[e] ? Nt[e] : _i[e] ?? "not-available" : "not-available";
}
const Ft = {
  "clear-night": "Clear",
  cloudy: "Cloudy",
  fog: "Foggy",
  hail: "Hail",
  lightning: "Thunderstorms",
  "lightning-rainy": "Thunderstorms",
  partlycloudy: "Partly Cloudy",
  pouring: "Heavy Rain",
  rainy: "Rain",
  snowy: "Snow",
  "snowy-rainy": "Sleet",
  sunny: "Sunny",
  windy: "Windy",
  "windy-variant": "Windy",
  exceptional: "Exceptional"
}, L = [
  [-10, [76, 110, 245]],
  [0, [77, 171, 247]],
  [8, [56, 217, 169]],
  [15, [169, 227, 75]],
  [21, [255, 212, 59]],
  [27, [255, 146, 43]],
  [33, [250, 82, 82]]
];
function Xt(e) {
  if (e <= L[0][0]) return `rgb(${L[0][1].join(",")})`;
  const t = L[L.length - 1];
  if (e >= t[0]) return `rgb(${t[1].join(",")})`;
  for (let i = 0; i < L.length - 1; i++) {
    const [s, a] = L[i], [o, r] = L[i + 1];
    if (e >= s && e <= o) {
      const n = (e - s) / (o - s);
      return `rgb(${a.map((d, p) => Math.round(d + (r[p] - d) * n)).join(",")})`;
    }
  }
  return "#ffffff";
}
const I = (e) => {
  const t = typeof e == "number" ? e : parseFloat(String(e));
  return Number.isFinite(t) ? t : void 0;
}, S = (e) => e === void 0 ? "--" : `${Math.round(e)}`, rt = (e) => A`
  <svg class="thead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true" .innerHTML=${e}></svg>`, V = {
  sunrise: rt(`<path d="M3 19h18"/><path d="M12 2.5v4"/><path d="M9.8 4.7 12 2.5l2.2 2.2"/>
    <path d="M6.6 15.5a5.4 5.4 0 0 1 10.8 0"/><path d="M2.5 15.5h1.6"/><path d="M19.9 15.5h1.6"/>`),
  wind: rt(`<path d="M3 8.5h9.5a2.75 2.75 0 1 0-2.75-2.75"/>
    <path d="M3 12.5h13a2.75 2.75 0 1 1-2.75 2.75"/><path d="M3 16.5h6.5"/>`),
  drop: rt('<path d="M12 3.2c0 0 5.8 6.3 5.8 10.1a5.8 5.8 0 0 1-11.6 0C6.2 9.5 12 3.2 12 3.2Z"/>'),
  thermometer: rt('<path d="M14 14.9V5.2a2 2 0 1 0-4 0v9.7a4 4 0 1 0 4 0Z"/>'),
  humidity: rt(`<path d="M12 3.2c0 0 5.6 6.1 5.6 9.9a5.6 5.6 0 0 1-11.2 0C6.4 9.3 12 3.2 12 3.2Z"/>
    <path d="M9.3 14.4c.7 1.2 1.9 1.8 3.3 1.7"/>`)
};
let w = class extends ht {
  constructor() {
    super(...arguments), this._hourly = [], this._daily = [], this._mapOpen = !1, this._mapFrame = 0, this._mapPlaying = !1, this._sheetDay = null, this._hourScrub = null, this._hourlyError = !1, this._hourlyPending = !1, this._mapRange = "12h", this._mapSeen = !1, this._mapT = 0, this._mapLast = 0, this._gridPending = !1, this._gridRetryAt = 0, this._gridBackoff = 0, this._outsideTap = (e) => {
      if (this._sheetDay === null) return;
      const t = e.composedPath(), i = this.renderRoot.querySelector(".daycard"), s = this.renderRoot.querySelector(".panel.daily");
      i && t.includes(i) || s && t.includes(s) || this._closeDaySheet();
    }, this._advance = (e) => {
      const t = Math.max(1, this._mapSeries.frames.length - 1), i = Math.min((e - this._mapLast) / 1e3, 0.25);
      this._mapLast = e, this._mapT = (this._mapT + i / w.FRAME_SECONDS) % t, this._paintMap(), this._syncMapBar();
      const s = Math.min(Math.round(this._mapT), t);
      s !== this._mapFrame && (this._mapFrame = s), this._mapRaf = requestAnimationFrame(this._advance);
    }, this._markPointer = (e) => {
      this._pointerDownAt = { x: e.clientX, y: e.clientY };
    };
  }
  setConfig(e) {
    if (!e?.entity) throw new Error('fruity-weather-card: "entity" is required');
    if (!e.entity.startsWith("weather."))
      throw new Error('fruity-weather-card: "entity" must be a weather.* entity');
    this._config = { hourly_hours: 24, daily_days: 10, ...e }, this._mapZoom = w._loadZoom();
  }
  getCardSize() {
    return 14;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("pointerdown", this._outsideTap, !0), this._unsubscribe(), this._stopPlayback(), this._mapResize?.disconnect(), this._mapResize = void 0, this._mapVisibility?.disconnect(), this._mapVisibility = void 0;
  }
  /**
   * Only spend API calls once the map is actually on screen.
   *
   * The card sits on dashboards that are opened and closed all day, and each
   * fetch costs 143 of a 10,000-call daily allowance. A view the user never
   * scrolls to should cost nothing.
   */
  _watchMapVisible() {
    if (this._mapSeen) {
      this._ensureGrid();
      return;
    }
    if (this._mapVisibility) return;
    const e = this.renderRoot.querySelector(".tile.map");
    e && (this._mapVisibility = new IntersectionObserver((t) => {
      t.some((i) => i.isIntersecting) && (this._mapSeen = !0, this._mapVisibility?.disconnect(), this._mapVisibility = void 0, this._ensureGrid());
    }, { rootMargin: "200px" }), this._mapVisibility.observe(e));
  }
  /**
   * The open/close spring animates width and height in CSS, which fires no Lit
   * update — so without this the canvas and the basemap would keep the size
   * they had when the class flipped, and the map would only be correct for one
   * of the two states. Watching the frame also covers window resizes.
   */
  _watchMapSize() {
    if (this._mapResize) return;
    const e = this.renderRoot.querySelector(".map-frame");
    if (!e) return;
    let t = !1;
    this._mapResize = new ResizeObserver(() => {
      t || (t = !0, requestAnimationFrame(() => {
        t = !1, this._paintMap(), this.requestUpdate();
      }));
    }), this._mapResize.observe(e);
  }
  updated(e) {
    super.updated(e), (e.has("hass") || e.has("_config")) && this.hass && this._config && (this._subscribedTo !== this._config.entity && this._subscribe(), this._config.map && this._watchMapVisible()), this._config?.map && (this._paintMap(), this._syncMapBar(), this._watchMapSize()), this._sheetDay !== null && (this._positionArrow(), this._positionReadout());
  }
  /* ------------------------------------------------ precipitation map ---- */
  /**
   * One fetch serves both the small tile and the expanded view.
   *
   * `updated()` runs on every hass state change — many times a second in a busy
   * install — so this MUST refuse to retry freely. It previously did, and a
   * single failure turned into a request storm that exhausted Open-Meteo's
   * whole daily quota: the API bills per location, so one 143-point call spends
   * 143 of the 10,000 daily allowance and the error is
   * "Daily API request limit exceeded. Please try again tomorrow." — not
   * something a retry can clear. Failures back off, doubling to 15 minutes.
   */
  async _ensureGrid() {
    const e = this.hass?.config?.latitude, t = this.hass?.config?.longitude;
    if (!(e === void 0 || t === void 0 || this._gridPending) && !(this._grid && Date.now() - this._grid.fetchedAt < ie) && !(Date.now() < this._gridRetryAt)) {
      this._gridPending = !0;
      try {
        this._grid = await ai(e, t), this._gridBackoff = 0, this._gridRetryAt = 0, this._mapT = 0, this._mapFrame = 0, this._mapOpen && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches && (await this.updateComplete, this._autoPlay());
      } catch (i) {
        this._gridBackoff = this._gridBackoff ? Math.min(this._gridBackoff * 2, 15 * 6e4) : 6e4, this._gridRetryAt = Date.now() + this._gridBackoff, console.warn(
          `fruity-weather-card: precipitation grid failed, retrying in ${this._gridBackoff / 1e3}s`,
          i
        );
      } finally {
        this._gridPending = !1;
      }
    }
  }
  // -- day-detail sheet ------------------------------------------------------
  /**
   * Ten days of hourly data, fetched lazily: nobody pays for it until a day is
   * actually opened, and the module caches it for an hour across reloads.
   */
  async _ensureHourly(e = !1) {
    const t = this.hass?.config?.latitude, i = this.hass?.config?.longitude;
    if (!(t === void 0 || i === void 0 || this._hourlyPending) && !(!e && this._hourlyDays && Date.now() - this._hourlyDays.fetchedAt < ae)) {
      this._hourlyPending = !0, this._hourlyError = !1;
      try {
        this._hourlyDays = await mi(t, i, e);
      } catch (s) {
        this._hourlyError = !0, console.warn("fruity-weather-card: hourly forecast failed", s);
      } finally {
        this._hourlyPending = !1;
      }
    }
  }
  _openDaySheet(e) {
    this._sheetDay === null ? (window.addEventListener("pointerdown", this._outsideTap, !0), this._reflowGrid(() => {
      this._sheetDay = e;
    }), this._hourScrub = null) : this._switchDay(e), this._ensureHourly();
  }
  /**
   * Push the card's contents sideways when the day changes — from the arrows or
   * from a different row of the daily list. The day being left accelerates out
   * and fades; the new one settles in from the opposite side, so the direction
   * of travel says which way through the week you moved.
   *
   * Both halves move AT ONCE, which needs a clone: the live element cannot be in
   * two places, and playing the exit before the entrance would leave the card
   * blank for the length of the first half. The clone is appended AFTER the real
   * body so `querySelector` in the post-render positioning still resolves to the
   * live one.
   *
   * Travel is a fraction of the width rather than the whole of it. This is a
   * detail swap inside a card that never moves, not a page turn, and the fade
   * carries most of the change; a full-width slide across dense content reads as
   * a lurch.
   */
  async _switchDay(e) {
    const t = this._sheetDay, i = this.renderRoot.querySelector(".sheet-stage"), s = this.renderRoot.querySelector(".sheet-body");
    if (this._hourScrub = null, t === null || t === e || !i || !s || w._reducedMotion()) {
      this._sheetDay = e;
      return;
    }
    i.querySelectorAll(".sheet-body.ghost").forEach((d) => d.remove());
    const a = s.cloneNode(!0);
    a.classList.add("ghost"), i.appendChild(a);
    const o = e > t ? 1 : -1, r = Math.min(i.getBoundingClientRect().width * 0.16, 90);
    this._sheetDay = e, await this.updateComplete;
    const n = a.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${-o * r}px)` }],
      { duration: 230, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
    );
    a.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 150, easing: "ease-in", fill: "forwards" }
    );
    const l = () => a.remove();
    n.addEventListener("finish", l), n.addEventListener("cancel", l), s.animate(
      [{ transform: `translateX(${o * r}px)` }, { transform: "translateX(0)" }],
      { duration: 380, delay: 60, easing: w.SPRING, fill: "backwards" }
    ), s.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 220, delay: 110, easing: "ease-out", fill: "backwards" }
    );
  }
  _closeDaySheet() {
    window.removeEventListener("pointerdown", this._outsideTap, !0), this._hourScrub = null, this._reflowGrid(() => {
      this._sheetDay = null;
    });
  }
  /**
   * Put the notch level with the selected row. The card itself is grid-placed
   * and never moves, so this is the only thing left to position — and it is
   * measured rather than derived, because the row height depends on how many
   * days the provider returned.
   */
  _positionArrow() {
    const e = this.renderRoot.querySelector(".daycard"), t = this.renderRoot.querySelector(".sheet-arrow"), i = this.renderRoot.querySelectorAll(".drow")[this._sheetDay ?? 0];
    if (!e || !t || !i) return;
    const s = e.getBoundingClientRect(), a = i.getBoundingClientRect(), o = Math.min(Math.max(a.top + a.height / 2 - s.top, 24), Math.max(s.height - 24, 24)), r = !t.style.top;
    r && (t.style.transition = "none"), t.style.top = `${Math.round(o)}px`, r && requestAnimationFrame(() => {
      t.style.transition = "";
    });
  }
  /** Hours for the day at `index` of the daily list, or [] when unavailable. */
  _hoursForDay(e) {
    const t = this._daily[e];
    return !t || !this._hourlyDays ? [] : this._hourlyDays.days.get(yi(new Date(t.datetime))) ?? [];
  }
  get _mapSeries() {
    const e = this._grid;
    return e ? this._mapRange === "1h" ? { times: e.quarter.times.slice(0, 5), frames: e.quarter.frames.slice(0, 5) } : e.hourly : { times: [], frames: [] };
  }
  /** Map centre: the grid's origin once loaded, otherwise HA's home. The
   *  BASEMAP must not depend on the forecast — Esri tiles and Open-Meteo are
   *  unrelated services, and gating the tiles on the grid turned a missing
   *  forecast into a blank white box. */
  get _mapCentre() {
    if (this._grid) return { lat: this._grid.lat0, lon: this._grid.lon0 };
    const e = this.hass?.config?.latitude, t = this.hass?.config?.longitude;
    return e === void 0 || t === void 0 ? void 0 : { lat: e, lon: t };
  }
  _paintMap() {
    const e = this.renderRoot.querySelector(".map-frame"), t = this._mapCentre;
    if (!e || !t) return;
    const i = e.getBoundingClientRect();
    if (!i.width || !i.height) return;
    const s = ni(t.lat, t.lon, this._zoom, i.width, i.height), a = this._mapViewport;
    this._mapViewport = s, (!a || a.z !== s.z || a.originX !== s.originX || a.originY !== s.originY || a.width !== s.width || a.height !== s.height) && this.requestUpdate();
    const o = this.renderRoot.querySelector(".map-heat");
    if (!o || !this._grid) return;
    const r = this._mapSeries, n = r.frames.length;
    if (!n) return;
    const l = Math.min(Math.max(this._mapT, 0), n - 1e-6), d = Math.floor(l), p = Math.min(d + 1, n - 1);
    let h = r.frames[d];
    p !== d && ((!this._mapScratch || this._mapScratch.length !== h.length) && (this._mapScratch = new Float32Array(h.length)), h = gi(r.frames[d], r.frames[p], l - d, this._mapScratch)), pi(o, this._grid, h, s);
  }
  /**
   * Opens/closes the map, animating the tiles it displaces.
   *
   * CSS cannot transition grid placement — a tile that moves from column 3 to
   * column 1 simply appears there — so the neighbours are animated with FLIP:
   * measure every tile First, apply the Last layout, invert each tile with a
   * transform back to where it was, then Play by removing the transform. The
   * map's own box is transitioned in CSS instead, because FLIP would scale it
   * and smear the map raster.
   */
  async _toggleMap() {
    const e = w._reducedMotion();
    await this._reflowGrid(
      () => {
        this._mapOpen = !this._mapOpen, this._mapOpen || (this._stopPlayback(), this._mapT = 0, this._mapFrame = 0);
      },
      // The map tile animates its own size through CSS; FLIPping it as well
      // would fight that.
      (t) => !t.classList.contains("map")
    ), this._mapOpen && !e && this._autoPlay();
  }
  static _reducedMotion() {
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }
  /**
   * FLIP the grid across a layout change: measure every child, apply `mutate`,
   * re-measure, then play each child from its old position to its new one.
   *
   * Everything that reflows the grid goes through here — opening or closing the
   * day card, expanding the map — so a card never teleports and every move uses
   * the same spring.
   */
  async _reflowGrid(e, t = () => !0) {
    const i = this.renderRoot.querySelector(".grid"), s = i ? [...i.children].filter(t) : [], a = new Map(s.map((r) => [r, r.getBoundingClientRect()]));
    if (e(), await this.updateComplete, w._reducedMotion()) return;
    const o = s.filter((r) => r.isConnected);
    for (const r of o) {
      const n = a.get(r), l = r.getBoundingClientRect(), d = n.left - l.left, p = n.top - l.top;
      !d && !p || (r.style.transition = "none", r.style.transform = `translate(${d}px, ${p}px)`);
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (const r of o)
        r.style.transform && (r.style.transition = `transform 420ms ${w.SPRING}`, r.style.transform = "", r.addEventListener("transitionend", () => {
          r.style.transition = "";
        }, { once: !0 }));
    }));
  }
  _togglePlayback() {
    if (this._mapPlaying) {
      this._stopPlayback();
      return;
    }
    this._mapPlaying = !0, this._mapLast = performance.now(), this._mapRaf = requestAnimationFrame(this._advance);
  }
  /**
   * Start the loop from the beginning if it is not already running and there is
   * something to animate. Separate from _togglePlayback because that one is a
   * toggle: called on an already-playing map it would PAUSE, which is the
   * opposite of what expanding should do.
   */
  _autoPlay() {
    this._mapPlaying || this._mapSeries.frames.length < 2 || (this._mapT = 0, this._mapFrame = 0, this._togglePlayback());
  }
  /**
   * The ONLY writer of the progress fill's width — deliberately not a `style`
   * binding in render().
   *
   * With both, the two fought: this method writes the continuous position 60
   * times a second, then every crossing of a frame boundary changed _mapFrame,
   * Lit re-rendered, and its binding replaced the inline style with the
   * ROUNDED position. Measured as a +4.3% jerk forward followed 12 ms later by
   * a 4.0% snap back, once per frame — visible only in motion, which is why it
   * never showed up in a screenshot. updated() calls this after every render
   * so the bar still repaints when Lit rebuilds the element.
   */
  _syncMapBar() {
    const e = this.renderRoot.querySelector(".map-track-fill");
    if (!e) return;
    const t = Math.max(1, this._mapSeries.frames.length - 1), i = Math.min(100, Math.max(0, this._mapT / t * 100));
    e.style.width = `${i}%`;
  }
  _stopPlayback() {
    this._mapRaf !== void 0 && cancelAnimationFrame(this._mapRaf), this._mapRaf = void 0, this._mapPlaying = !1;
  }
  /**
   * Effective zoom, shared by both states — expanding grows the box, it does
   * not change scale. ZOOM_MIN is the default so the card opens on the widest
   * view; anything the user picks from there overrides it.
   */
  get _zoom() {
    return this._mapZoom ?? this._config?.map_zoom ?? w.ZOOM_MIN;
  }
  /**
   * The chosen zoom outlives the expanded view AND the page: closing the tile
   * used to throw it away, so every glance at the map started zoomed all the
   * way out again.
   */
  static _loadZoom() {
    try {
      const e = localStorage.getItem(w.ZOOM_KEY);
      if (e === null) return;
      const t = Number(e);
      return Number.isFinite(t) ? Math.min(
        w.ZOOM_MAX,
        Math.max(w.ZOOM_MIN, Math.round(t))
      ) : void 0;
    } catch {
      return;
    }
  }
  _zoomBy(e) {
    const t = Math.min(
      w.ZOOM_MAX,
      Math.max(w.ZOOM_MIN, this._zoom + e)
    );
    if (t !== this._zoom) {
      this._mapZoom = t;
      try {
        localStorage.setItem(w.ZOOM_KEY, String(t));
      } catch {
      }
    }
  }
  _setRange(e) {
    this._mapRange !== e && (this._mapRange = e, this._mapT = 0, this._mapFrame = 0, this._paintMap(), this._syncMapBar());
  }
  _scrub(e) {
    const i = e.currentTarget.getBoundingClientRect(), s = this._mapSeries.frames.length, a = Math.min(1, Math.max(0, (e.clientX - i.left) / i.width));
    this._stopPlayback(), this._mapT = a * (s - 1), this._mapFrame = Math.round(this._mapT), this._paintMap(), this._syncMapBar();
  }
  _unsubscribe() {
    this._unsubHourly?.(), this._unsubDaily?.(), this._unsubHourly = void 0, this._unsubDaily = void 0, this._subscribedTo = void 0;
  }
  /* ---------------------------------------------------------- tap actions */
  /**
   * A click handler for one region, or `undefined` when nothing is configured
   * — returning undefined rather than a no-op keeps `?tappable=` and the
   * pointer cursor honest about which regions actually do something.
   *
   * The pointer-position check is for the hourly strip: it scrolls
   * horizontally, and a drag ends in a `click` that would otherwise navigate
   * away mid-swipe. 8px is below any deliberate tap wobble.
   */
  _tap(e) {
    const t = this._config?.tap_actions?.[e];
    if (!(!t || t.action === "none"))
      return (i) => {
        i.stopPropagation();
        const s = this._pointerDownAt, a = i;
        s && Math.hypot(a.clientX - s.x, a.clientY - s.y) > 8 || this._runAction(t);
      };
  }
  /** Shared with _tap: a drag that ends over a target is not a tap on it. */
  _movedSincePointer(e) {
    const t = this._pointerDownAt, i = e;
    return !!t && Math.hypot(i.clientX - t.x, i.clientY - t.y) > 8;
  }
  /**
   * Hand-rolled rather than pulled from custom-card-helpers: the card has no
   * runtime dependencies beyond lit, and this is the whole surface HA's own
   * handler exposes for a tap.
   */
  _runAction(e) {
    switch (e.action) {
      case "navigate": {
        if (!e.navigation_path) return;
        history.pushState(null, "", e.navigation_path), window.dispatchEvent(new Event("location-changed", { composed: !0 }));
        break;
      }
      case "more-info": {
        const t = e.entity ?? this._config?.entity;
        if (!t) return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: t },
          bubbles: !0,
          composed: !0
        }));
        break;
      }
      case "url":
        e.url_path && window.open(e.url_path, "_blank", "noopener");
        break;
      case "toggle":
        e.entity && this.hass?.callService("homeassistant", "toggle", { entity_id: e.entity });
        break;
      case "perform-action":
      case "call-service": {
        const t = e.perform_action ?? e.service;
        if (!t?.includes(".")) return;
        const [i, s] = t.split(".", 2);
        this.hass?.callService(i, s, e.data ?? {}, e.target);
        break;
      }
    }
  }
  /**
   * Forecasts come over the websocket, not from entity attributes — modern HA
   * weather entities no longer carry a `forecast` attribute at all.
   */
  async _subscribe() {
    if (!this.hass || !this._config) return;
    const e = this._config.entity;
    this._unsubscribe(), this._subscribedTo = e;
    const t = async (i, s) => {
      try {
        return await this.hass.connection.subscribeMessage(
          (a) => s(a.forecast ?? []),
          { type: "weather/subscribe_forecast", entity_id: e, forecast_type: i }
        );
      } catch (a) {
        console.warn(`fruity-weather-card: no ${i} forecast for ${e}`, a);
        return;
      }
    };
    this._unsubHourly = await t("hourly", (i) => {
      this._hourly = i;
    }), this._unsubDaily = await t("daily", (i) => {
      this._daily = i;
    });
  }
  // -- data accessors -------------------------------------------------------
  get _weather() {
    return this.hass?.states[this._config.entity];
  }
  /** Read an optional override sensor, falling back to a weather attribute. */
  _override(e, t) {
    const i = this._config?.current?.[e];
    if (i) {
      const s = this.hass?.states[i];
      if (s && s.state !== "unavailable" && s.state !== "unknown") return I(s.state);
    }
    return t ? I(this._weather?.attributes[t]) : void 0;
  }
  /**
   * Unit that belongs to whatever _override() actually returned. Critical: when
   * an override sensor supplies the value, the unit must come from that sensor
   * too — HA's `unit_system.wind_speed` describes the weather entity, not a
   * local station, and mixing them silently mislabels km/h readings as m/s.
   */
  _overrideUnit(e, t) {
    const i = this._config?.current?.[e];
    if (i) {
      const s = this.hass?.states[i];
      if (s && s.state !== "unavailable" && s.state !== "unknown")
        return s.attributes?.unit_of_measurement;
    }
    return t ? this._weather?.attributes[t] : void 0;
  }
  get _isNight() {
    const e = this.hass?.states[this._config?.sun_entity ?? "sun.sun"];
    return e ? e.state === "below_horizon" : !1;
  }
  _sunTimes() {
    const e = this.hass?.states[this._config?.sun_entity ?? "sun.sun"];
    if (!e) return {};
    const t = e.attributes.next_rising ? new Date(e.attributes.next_rising) : void 0, i = e.attributes.next_setting ? new Date(e.attributes.next_setting) : void 0;
    return { rising: t, setting: i };
  }
  /**
   * Split a time into digits and AM/PM so the suffix can be set smaller, the
   * way iOS does ("6:22" large, "AM" small, no space between them). On 24-hour
   * locales `suffix` is empty and the digits simply render alone.
   */
  _fmtTimeParts(e, t = !0) {
    const i = this.hass?.locale?.language ?? navigator.language, s = new Intl.DateTimeFormat(i, t ? { hour: "numeric", minute: "2-digit" } : { hour: "numeric" });
    let a = "", o = "";
    for (const r of s.formatToParts(e))
      r.type === "dayPeriod" ? o = r.value.toUpperCase() : (r.type !== "literal" || a) && (a += r.value);
    return { time: a.trim(), suffix: o };
  }
  /**
   * Strip label in iOS form: hour and period marker closed up with no space
   * ("11PM"), the marker set smaller. On 24-hour locales the marker is empty
   * and only the hour renders.
   */
  _timeLabel(e, t = !1) {
    const { time: i, suffix: s } = this._fmtTimeParts(e, t);
    return A`${i}${s ? A`<span class="ap">${s}</span>` : m}`;
  }
  /**
   * Geometry for the sun-path graphic: a full 24h cycle where daylight occupies
   * the arc above the horizon and night dips below it, plus the sun's current
   * position along that curve.
   *
   * Daylight is bracketed by a real rise/set pair. At night `next_rising` comes
   * first so the pair is (rising, setting); during the day the sun rose
   * yesterday, so we step `next_rising` back 24h to get the pair around now.
   */
  _sunArc() {
    const { rising: e, setting: t } = this._sunTimes();
    if (!e || !t) return;
    const i = 864e5, s = Date.now(), a = 0.2, o = 0.8, r = 26, n = 17, l = 11, d = 100, p = (g) => g >= a && g <= o ? Math.sin(Math.PI * (g - a) / (o - a)) : g < a ? -Math.sin(Math.PI * ((a - g) / (2 * a))) : -Math.sin(Math.PI * ((g - o) / (2 * (1 - o)))), h = (g) => r - g * (g >= 0 ? n : l), c = (g, v, _) => {
      const x = [];
      for (let k = 0; k <= _; k++) {
        const z = g + (v - g) * k / _;
        x.push(`${(z * d).toFixed(2)},${h(p(z)).toFixed(2)}`);
      }
      return `M${x.join(" L")}`;
    }, u = (g) => Math.min(Math.max(g, 0), 1);
    let y;
    if (t < e) {
      const g = e.getTime() - i, v = u((s - g) / (t.getTime() - g));
      y = a + v * (o - a);
    } else {
      const g = t.getTime() - i, v = u((s - g) / (e.getTime() - g));
      y = v < 0.5 ? o + v / 0.5 * (1 - o) : (v - 0.5) / 0.5 * a;
    }
    const b = p(y);
    return {
      nightPath: c(0, 1, 96),
      dayPath: c(a, o, 48),
      dotX: y * 100,
      dotY: h(b) / 44 * 100,
      isUp: b >= 0
    };
  }
  _iconUrl(e) {
    const t = this._config?.icons_path;
    return t ? `${t.replace(/\/+$/, "")}/${e}.png` : new URL((/* @__PURE__ */ Object.assign({ "../icons/clear.png": ge, "../icons/cloudy.png": ue, "../icons/drizzle.png": fe, "../icons/fog.png": Ae, "../icons/freezing_rain.png": me, "../icons/haze.png": ye, "../icons/heavy_rain.png": we, "../icons/heavy_snow.png": be, "../icons/night_clear.png": ve, "../icons/night_cloudy.png": xe, "../icons/night_drizzle.png": _e, "../icons/partly_cloudy.png": ke, "../icons/rain.png": Ce, "../icons/snow.png": Se, "../icons/sunrise.png": Be, "../icons/sunset.png": Oe, "../icons/thunderstorm.png": Ee, "../icons/windy.png": $e }))[`../icons/${e}.png`], import.meta.url).href;
  }
  // -- render ---------------------------------------------------------------
  render() {
    if (!this.hass || !this._config) return m;
    const e = this._weather;
    return e ? A`
      <ha-card class=${this._isNight ? "night" : "day"}>
        ${this._renderHero(e)}
        ${this._renderHourly()}
        <div class="grid">
          ${this._renderDaily()}
          ${this._renderDaySheet()}
          ${this._renderTiles()}
        </div>
      </ha-card>
    ` : A`<ha-card><div class="err">Entity ${this._config.entity} not found</div></ha-card>`;
  }
  /**
   * Scene artwork behind the hero, matched to the condition. HA reports most
   * conditions identically day and night, so those get a `-night` variant
   * chosen off the sun entity; `clear-night` already encodes it, and
   * `exceptional` has no artwork of its own so it borrows cloudy.
   */
  _heroScene(e) {
    const t = [
      "partlycloudy",
      "cloudy",
      "fog",
      "rainy",
      "pouring",
      "lightning",
      "lightning-rainy",
      "hail",
      "snowy",
      "snowy-rainy",
      "windy",
      "windy-variant"
    ], i = this._isNight;
    return e === "clear-night" || e === "sunny" ? i ? "clear-night" : "sunny" : t.includes(e) ? e + (i ? "-night" : "") : e === "exceptional" ? i ? "cloudy-night" : "cloudy" : null;
  }
  _renderHero(e) {
    const t = this._config.name ?? e.attributes.friendly_name ?? this._config.entity, i = this._override("temperature", "temperature"), s = this._daily[0], a = I(s?.temperature), o = I(s?.templow), r = Ft[e.state] ?? e.state, n = this._tap("hero"), l = this._heroScene(e.state), d = this._config, p = (u) => typeof u == "number" ? `${u}px` : u, h = [], c = (d.backgrounds_path ?? xi).replace(/\/+$/, "");
    return l && h.push(`--fwc-hero: url("${c}/hero-${l}.jpg?v=2")`), d.hero_bleed_x !== void 0 && h.push(`--fwc-hero-bleed-x: ${p(d.hero_bleed_x)}`), d.hero_bleed_top !== void 0 && h.push(`--fwc-hero-bleed-top: ${p(d.hero_bleed_top)}`), d.hero_extend !== void 0 && h.push(`--fwc-hero-extend: ${p(d.hero_extend)}`), d.hero_radius !== void 0 && h.push(`--fwc-hero-radius: ${p(d.hero_radius)}`), A`
      <div class="hero ${l ? "has-bg" : ""}" ?tappable=${!!n}
           style=${h.join("; ")}
           @pointerdown=${this._markPointer} @click=${n}>
        <div class="loc">${t}</div>
        <div class="temp">${S(i)}<span class="deg">°</span></div>
        <div class="cond">${r}</div>
        <div class="hilo">H:${S(a)}° L:${S(o)}°</div>
      </div>
    `;
  }
  /** 24-hour strip with sunrise/sunset woven in at their real position. */
  _renderHourly() {
    if (!this._hourly.length) return m;
    const e = this._config.hourly_hours ?? 24, t = Date.now(), i = t + e * 36e5, s = [];
    this._hourly.forEach((h, c) => {
      const u = new Date(h.datetime);
      u.getTime() > i || s.push({
        kind: "hour",
        time: u,
        label: c === 0 ? A`Now` : this._timeLabel(u),
        condition: h.condition ?? "",
        temp: I(h.temperature)
      });
    });
    const { rising: a, setting: o } = this._sunTimes();
    for (const [h, c] of [[a, "sunrise"], [o, "sunset"]])
      h && h.getTime() > t && h.getTime() < i && s.push({ kind: "sun", time: h, label: this._timeLabel(h, !0), event: c });
    s.sort((h, c) => h.time.getTime() - c.time.getTime());
    const r = this._override("wind_gust"), n = this._overrideUnit("wind_gust", "wind_speed_unit") ?? "km/h", l = Ft[this._weather?.state ?? ""] ?? "", d = l ? `${l} conditions expected for the rest of the day.` + (r !== void 0 ? ` Wind gusts are up to ${S(r)} ${n}.` : "") : "", p = this._tap("hourly");
    return A`
      <div class="panel strip" ?tappable=${!!p}
           @pointerdown=${this._markPointer} @click=${p}>
        ${d ? A`<div class="strip-summary">${d}</div>` : m}
        <div class="row">
          ${s.map((h) => h.kind === "sun" ? A`
                <div class="cell">
                  <div class="cell-label">${h.label}</div>
                  <img class="cell-icon" src=${this._iconUrl(ki[h.event])} alt=${h.event} />
                  <div class="cell-val sun">${h.event === "sunrise" ? "Sunrise" : "Sunset"}</div>
                </div>` : A`
                <div class="cell">
                  <div class="cell-label">${h.label}</div>
                  <img class="cell-icon" src=${this._iconUrl(ot(h.condition, this._nightAt(h.time)))} alt=${h.condition} />
                  <div class="cell-val">${S(h.temp)}°</div>
                </div>`)}
        </div>
      </div>
    `;
  }
  /**
   * Whether the sun is below the horizon at `t`.
   *
   * Which of next_rising/next_setting comes first tells us the CURRENT state:
   * if the sun rises before it sets, it must be down right now. From there the
   * next event is the only boundary inside the 24h window we render.
   */
  _nightAt(e) {
    const { rising: t, setting: i } = this._sunTimes();
    return !t || !i ? this._isNight : t < i ? e < t || e >= i : e >= i && e < t;
  }
  _renderDaily() {
    const e = this._daily.slice(0, this._config.daily_days ?? 10);
    if (!e.length) return m;
    const t = e.map((d) => I(d.templow)).filter((d) => d !== void 0), i = e.map((d) => I(d.temperature)).filter((d) => d !== void 0), s = Math.min(...t, ...i), a = Math.max(...t, ...i), o = Math.max(a - s, 1), r = this._override("temperature", "temperature"), n = this.hass?.locale?.language ?? navigator.language, l = this._tap("daily");
    return A`
      <div class="panel daily" ?tappable=${!!l}
           @pointerdown=${this._markPointer} @click=${l}>
        <div class="panel-head">${e.length}-DAY FORECAST</div>
        ${e.map((d, p) => {
      const h = I(d.templow), c = I(d.temperature), u = new Date(d.datetime), y = p === 0 ? "Today" : u.toLocaleDateString(n, { weekday: "short" }), b = h === void 0 ? 0 : (h - s) / o * 100, g = h === void 0 || c === void 0 ? 0 : (c - h) / o * 100, v = p === 0 && r !== void 0 ? (r - s) / o * 100 : void 0;
      return A`
            <div class="drow" tappable
                 @pointerdown=${this._markPointer}
                 @click=${(_) => {
        _.stopPropagation(), !this._movedSincePointer(_) && (this._sheetDay === p ? this._closeDaySheet() : this._openDaySheet(p));
      }}>
              <div class="dday">${y}</div>
              <img class="dicon" src=${this._iconUrl(ot(d.condition, p === 0 && this._isNight))} alt=${d.condition ?? ""} />
              <div class="dlo">${S(h)}°</div>
              <div class="track">
                <div class="bar" style=${`left:${b}%;width:${g}%;background:linear-gradient(90deg, ${Xt(h ?? s)}, ${Xt(c ?? a)})`}></div>
                ${v !== void 0 ? A`<div class="dot" style=${`left:${Math.min(Math.max(v, 0), 100)}%`}></div>` : m}
              </div>
              <div class="dhi">${S(c)}°</div>
            </div>
          `;
    })}
      </div>
    `;
  }
  /**
   * The day-detail card: that day's high and low, a row of condition glyphs and
   * an hourly temperature curve. It is a GRID CARD, not an overlay — it takes
   * three columns beside the daily list and pushes the tiles along, so nothing
   * is hidden behind it and its position never moves. Only the notch travels,
   * to point at whichever row is selected.
   *
   * The H/L printed here come from the CURVE, not from the daily list row, so
   * the numbers and the picture always agree. They can differ by a degree or
   * two from the row because the row is the Home Assistant weather entity while
   * the curve is Open-Meteo — see hourly-source.ts for why.
   */
  _renderDaySheet() {
    const e = this._sheetDay;
    if (e === null) return m;
    const t = this._daily.slice(0, this._config.daily_days ?? 10), i = t[e];
    if (!i) return m;
    const s = this.hass?.locale?.language ?? navigator.language, a = new Date(i.datetime), o = this._hoursForDay(e), r = this.hass?.config?.unit_system?.temperature ?? "°C";
    return A`
      <div class="daycard">
        <svg class="sheet-arrow" viewBox="0 0 26 36" aria-hidden="true">
          <polygon points="26,0 1,18 26,36" />
          <polyline points="26,0 1,18 26,36" />
        </svg>
          <button class="snav prev" ?disabled=${e === 0}
                  @click=${() => this._openDaySheet(e - 1)}>
            ${P`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15 5 L8 12 L15 19" /></svg>`}
          </button>
          <button class="snav next" ?disabled=${e >= t.length - 1}
                  @click=${() => this._openDaySheet(e + 1)}>
            ${P`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M9 5 L16 12 L9 19" /></svg>`}
          </button>
          <div class="sheet-stage">
            <div class="sheet-body">
              <div class="sheet-date">
                ${a.toLocaleDateString(s, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })}
              </div>
              ${this._renderSheetBody(o, r, i)}
            </div>
          </div>
      </div>
    `;
  }
  _renderSheetBody(e, t, i) {
    if (this._hourlyPending && !e.length)
      return A`<div class="sheet-note">Loading hourly forecast…</div>`;
    if (this._hourlyError && !e.length)
      return A`
        <div class="sheet-note">
          Hourly forecast unavailable.
          <button class="sheet-retry" @click=${() => this._ensureHourly(!0)}>Retry</button>
        </div>
      `;
    if (!e.length)
      return A`<div class="sheet-note">No hourly forecast for this day.</div>`;
    const s = e.map((f) => f.temp), a = Math.max(...s), o = Math.min(...s), r = e[s.indexOf(a)], n = e[s.indexOf(o)], l = 5, d = Math.floor(o / l) * l, p = Math.ceil(a / l) * l, h = Math.max(p - d, l), c = 4;
    let u = l;
    for (; Math.floor(h / u) + 1 > c; ) u += l;
    const y = [];
    for (let f = p; f >= d - 1e-3; f -= u) y.push(f);
    const b = e.length, g = (f) => b > 1 ? f / (b - 1) * 100 : 50, v = (f) => (p - f) / h * 100, _ = Date.now();
    let x = null;
    if (b > 1 && _ > e[0].time && _ < e[b - 1].time) {
      for (let f = 0; f < b - 1; f++)
        if (_ < e[f + 1].time) {
          x = f + (_ - e[f].time) / (e[f + 1].time - e[f].time);
          break;
        }
    }
    const k = (f) => x !== null && f < x, z = e.map((f, C) => `${g(C)},${v(f.temp)}`).join(" ");
    let X = "", tt = z, Q = "", et = `0,100 ${z} 100,100`;
    if (x !== null) {
      const f = Math.floor(x), C = x - f, T = g(x), H = v(e[f].temp + (e[f + 1].temp - e[f].temp) * C), ut = e.slice(0, f + 1).map((it, st) => `${g(st)},${v(it.temp)}`).join(" "), Y = e.slice(f + 1).map((it, st) => `${g(f + 1 + st)},${v(it.temp)}`).join(" ");
      X = `${ut} ${T},${H}`, tt = `${T},${H} ${Y}`, Q = `0,100 ${X} ${T},100`, et = `${T},100 ${tt} 100,100`;
    }
    const gt = Math.max(1, Math.round(b / 8)), M = this._hourScrub !== null ? e[this._hourScrub] : void 0;
    return A`
      <div class="sheet-readout ${M ? "scrubbing" : ""}">
        ${M ? A`
              <div class="sheet-hilo scrubbing">
                <img class="sheet-cond"
                     src=${this._iconUrl(ot(M.condition, this._nightAt(new Date(M.time))))}
                     alt=${M.condition} />
                <span class="scrub-temp">${S(M.temp)}°</span>
              </div>
            ` : A`
              <div class="sheet-hilo">
                <span class="sheet-hi">${S(a)}°</span><span class="sheet-lo">${S(o)}°</span>
                <img class="sheet-cond"
                     src=${this._iconUrl(ot(i.condition, !1))} alt="" />
              </div>
            `}
        <div class="sheet-unit">
          ${M ? this._clockLabel(new Date(M.time)) : t === "°F" ? "Fahrenheit (°F)" : "Celsius (°C)"}
        </div>
      </div>

      <div class="sheet-glyphs">
        ${e.map((f, C) => C % gt === 0 ? A`<img class="sglyph ${C === 0 ? "first" : C === b - 1 ? "last" : ""} ${k(C) ? "past" : ""}"
                      style=${`left:${g(C)}%`}
                      src=${this._iconUrl(ot(f.condition, this._nightAt(new Date(f.time))))}
                      alt=${f.condition} />` : m)}
      </div>

      <div class="sheet-chart">
        <div class="sheet-plot"
             @pointerdown=${(f) => this._scrubAt(f, b)}
             @pointermove=${(f) => this._scrubAt(f, b)}
             @pointerup=${() => {
      this._hourScrub = null;
    }}
             @pointercancel=${() => {
      this._hourScrub = null;
    }}
             @pointerleave=${() => {
      this._hourScrub = null;
    }}>
          ${y.map((f) => A`
            <div class="sgl" style=${`top:${v(f)}%`}></div>`)}
          ${x !== null ? A`<div class="now-line" style=${`left:${g(x)}%`}></div>` : m}
          <!-- The conditional shapes below use lit's svg tag, not html: a
               nested html template is parsed in the HTML namespace, so its
               polygon comes out as an unknown HTML element and never paints. -->
          <svg class="scurve" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f5a623" stop-opacity="0.75" />
                <stop offset="55%" stop-color="#57c8c8" stop-opacity="0.40" />
                <stop offset="100%" stop-color="#3f7fb0" stop-opacity="0.18" />
              </linearGradient>
              <linearGradient id="sfillpast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#9ba4a8" stop-opacity="0.26" />
                <stop offset="55%" stop-color="#7d888d" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#68737a" stop-opacity="0.07" />
              </linearGradient>
            </defs>
            ${Q ? P`<polygon points=${Q} fill="url(#sfillpast)" />` : m}
            <polygon points=${et} fill="url(#sfill)" />
            ${X ? P`<polyline class="past" points=${X} vector-effect="non-scaling-stroke" />` : m}
            <polyline points=${tt} vector-effect="non-scaling-stroke" />
          </svg>
          ${(() => {
      const f = v(a), C = v(o), T = e.indexOf(r), H = e.indexOf(n);
      return A`
              <div class="smark hi ${f < 22 ? "flip" : ""} ${k(T) ? "past" : ""}"
                   style=${`left:${g(T)}%; top:${f}%`}>
                <span>H</span>
              </div>
              <div class="smark lo ${C > 78 ? "flip" : ""} ${k(H) ? "past" : ""}"
                   style=${`left:${g(H)}%; top:${C}%`}>
                <span>L</span>
              </div>
            `;
    })()}
          ${M ? A`
                <div class="scrub-line" style=${`left:${g(this._hourScrub)}%`}></div>
                <div class="scrub-dot" style=${`left:${g(this._hourScrub)}%; top:${v(M.temp)}%`}></div>
              ` : m}
        </div>
        <div class="sheet-yaxis">
          ${y.map((f) => A`<span style=${`top:${v(f)}%`}>${S(f)}°</span>`)}
        </div>
      </div>

      <div class="sheet-xaxis">
        ${e.map((f, C) => f.hour % 6 === 0 && f.hour !== 0 ? A`<span class="${C === b - 1 ? "last" : ""} ${k(C) ? "past" : ""}"
                       style=${`left:${g(C)}%`}>${this._hourLabel(f.hour)}</span>` : m)}
      </div>
    `;
  }
  /**
   * Slide the scrub readout so it sits over the line it describes, clamped to
   * the sheet so it never hangs off an edge. Measured after render because it
   * needs the readout's own width, which changes with the temperature's digits.
   */
  _positionReadout() {
    const e = this.renderRoot.querySelector(".sheet-readout"), t = this.renderRoot.querySelector(".sheet-plot");
    if (!e) return;
    if (this._hourScrub === null || !t) {
      e.style.transform = "translateX(0)";
      return;
    }
    const i = this.renderRoot.querySelector(".daycard"), s = this._hoursForDay(this._sheetDay ?? 0).length;
    if (!i || s < 2) return;
    const a = this._hourScrub / (s - 1);
    e.style.transform = "translateX(0)";
    const o = e.getBoundingClientRect(), r = t.getBoundingClientRect(), n = i.getBoundingClientRect(), l = getComputedStyle(i), d = parseFloat(l.paddingLeft) || 0, p = parseFloat(l.paddingRight) || 0, h = r.left + a * r.width, c = n.left + d - o.left, u = n.right - p - o.width - o.left, y = Math.min(Math.max(h - o.width / 2 - o.left, c), Math.max(u, c));
    e.style.transform = `translateX(${Math.round(y)}px)`;
  }
  /** Nearest hour under the pointer, clamped to the series. */
  _scrubAt(e, t) {
    const i = e.currentTarget.getBoundingClientRect();
    if (!i.width || t < 1) return;
    const s = Math.round((e.clientX - i.left) / i.width * (t - 1)), a = Math.min(Math.max(s, 0), t - 1);
    a !== this._hourScrub && (this._hourScrub = a);
  }
  /** "2:04 PM" in the user's own clock format. */
  _clockLabel(e) {
    const t = this.hass?.locale?.time_format, i = t === "12" ? !0 : t === "24" ? !1 : void 0, s = this.hass?.locale?.language ?? navigator.language;
    return new Intl.DateTimeFormat(s, { hour: "numeric", minute: "2-digit", hour12: i }).format(e);
  }
  /**
   * "6AM" / "6PM", or 24-hour when that is what the user has set. The period
   * marker is split out so it can be set smaller than the hour, the way the
   * sunrise/sunset tile prints its times.
   */
  _hourLabel(e) {
    const t = this.hass?.locale?.time_format, i = t === "12" ? !0 : t === "24" ? !1 : void 0, s = this.hass?.locale?.language ?? navigator.language, a = new Intl.DateTimeFormat(s, { hour: "numeric", hour12: i }).formatToParts(new Date(2e3, 0, 1, e));
    let o = "", r = "";
    for (const n of a)
      n.type === "dayPeriod" ? r = n.value : n.type === "literal" && r || (o += n.value);
    return A`${o.trim()}${r ? A`<span class="ap">${r}</span>` : m}`;
  }
  /**
   * The iOS sunrise/sunset tile: heading, the next event's time with a smaller
   * AM/PM, a full-bleed horizon line crossed by the sun's daily arc, a glowing
   * dot at the sun's current position, and the opposite event underneath.
   */
  _renderSunTile(e, t, i) {
    const s = e ? t : i, a = e ? i : t, o = s ? this._fmtTimeParts(s) : { time: "--", suffix: "" }, r = a ? this._fmtTimeParts(a) : { time: "--", suffix: "" }, n = this._sunArc(), l = this._tap("sun");
    return A`
      <div class="tile sun-tile" ?tappable=${!!l}
           @pointerdown=${this._markPointer} @click=${l}>
        <div class="tile-head">${V.sunrise} ${e ? "SUNRISE" : "SUNSET"}</div>
        <div class="tile-value time">
          <span class="digits">${o.time}</span><span class="ampm">${o.suffix}</span>
        </div>
        ${n ? A`
              <div class="sunarc">
                <svg viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true">
                  <path class="arc-night" d=${n.nightPath}></path>
                  <path class="arc-day" d=${n.dayPath}></path>
                </svg>
                <div class="horizon"></div>
                <div
                  class="sunglow ${n.isUp ? "up" : "down"}"
                  style=${`left:${n.dotX.toFixed(2)}%;top:${n.dotY.toFixed(2)}%`}
                ></div>
                <div
                  class="sundot ${n.isUp ? "up" : "down"}"
                  style=${`left:${n.dotX.toFixed(2)}%;top:${n.dotY.toFixed(2)}%`}
                ></div>
              </div>` : m}
        <div class="tile-note sun-note">
          ${e ? "Sunset: " : "Sunrise: "}<span class="digits-sm">${r.time}</span
          ><span class="ampm-sm">${r.suffix}</span>
        </div>
      </div>
    `;
  }
  _renderTiles() {
    const { rising: e, setting: t } = this._sunTimes(), i = this._override("feels_like", "apparent_temperature"), s = this._override("temperature", "temperature"), a = this._override("humidity", "humidity"), o = this._override("dew_point", "dew_point"), r = this._override("wind_speed", "wind_speed"), n = this._override("wind_gust"), l = this._override("wind_bearing", "wind_bearing"), d = this._override("precipitation_today"), p = this._overrideUnit("wind_speed", "wind_speed_unit") ?? "km/h", h = this._overrideUnit("wind_gust") ?? p, c = e && t ? e < t : !0, u = i === void 0 || s === void 0 ? "" : Math.abs(i - s) < 0.5 ? "Similar to the actual temperature." : i > s ? "It feels warmer than the actual temperature." : "It feels cooler than the actual temperature.", y = this._daily.find((k) => (I(k.precipitation) ?? 0) > 0), b = this.hass?.locale?.language ?? navigator.language, g = y ? I(y.precipitation) ?? 0 : void 0, v = g === void 0 ? "" : `${g < 1 ? "<1" : Math.round(g)} mm`, _ = y ? new Date(y.datetime).toDateString() === (/* @__PURE__ */ new Date()).toDateString() : !1, x = v ? _ ? `${v} more expected today.` : `Next expected is ${v} ${new Date(y.datetime).toLocaleDateString(b, { weekday: "short" })}.` : "None expected in the next 10 days.";
    return A`
        ${this._renderSunTile(c, e, t)}
        ${this._renderWindTile(r, p, n, h, l)}

        <div class="tile" ?tappable=${!!this._tap("precipitation")}
             @pointerdown=${this._markPointer} @click=${this._tap("precipitation")}>
          <div class="tile-head">${V.drop} PRECIPITATION</div>
          <div class="tile-value">${d === void 0 ? "--" : S(d)} mm</div>
          <div class="tile-sub">Today So Far</div>
          <div class="tile-note">${x}</div>
        </div>

        <div class="tile" ?tappable=${!!this._tap("feels_like")}
             @pointerdown=${this._markPointer} @click=${this._tap("feels_like")}>
          <div class="tile-head">${V.thermometer} FEELS LIKE</div>
          <div class="tile-value">${S(i)}°</div>
          <div class="tile-note">${u}</div>
        </div>

        <div class="tile" ?tappable=${!!this._tap("humidity")}
             @pointerdown=${this._markPointer} @click=${this._tap("humidity")}>
          <div class="tile-head">${V.humidity} HUMIDITY</div>
          <div class="tile-value">${S(a)}%</div>
          <div class="tile-note">
            ${o !== void 0 ? A`The dew point is ${S(o)}° right now.` : m}
          </div>
        </div>

        ${this._config?.map ? this._renderMapTile() : m}
    `;
  }
  /**
   * Precipitation map: a 2x2 tile wrapping an embedded Windy frame, centred on
   * the HA home coordinates.
   *
   * Home Assistant ships no radar imagery. Its map card takes entities, zones
   * and geolocation sources only, and no installed integration exposes a radar
   * entity, so the picture has to come from outside. Windy is the one embed
   * that frames cleanly (RainViewer's hangs on "Fetching map data").
   *
   * The frame is deliberately inert: a transparent sheet over it swallows
   * pointer events so a stray swipe on the kiosk cannot pan the map out of
   * position or start Windy's timeline animation.
   */
  _renderMapTile() {
    const e = this._grid, t = this._mapViewport, i = this._override("temperature", "temperature"), s = this.hass?.locale?.language ?? navigator.language;
    let a = "50%", o = "50%";
    const r = this._mapCentre;
    r && t && (a = `${(wt(r.lon, t.z) * 256 - t.originX) / t.width * 100}%`, o = `${(bt(r.lat, t.z) * 256 - t.originY) / t.height * 100}%`);
    const n = e ? this._mapSeries : void 0, l = n ? Math.min(this._mapFrame, n.frames.length - 1) : 0, d = n ? new Date(n.times[l]) : void 0, p = this._config?.map_style ?? "dark", h = t ? li(t, p) : [];
    return A`
      <div class="tile map ${p} ${this._mapOpen ? "open" : ""}"
           @click=${() => {
      this._mapOpen || this._toggleMap();
    }}>
        <div class="tile-head">${V.drop} PRECIPITATION</div>
        <div class="map-frame">
          <div class="map-base">
            ${h.map((c) => A`
              <img class="map-tile" src=${c.base} alt="" style=${`left:${c.left}px;top:${c.top}px;width:${c.size}px;height:${c.size}px`} />`)}
          </div>
          <canvas class="map-heat"></canvas>
          <!-- Labels ride ABOVE the heat field, as they do in the reference:
               place names stay readable through the colour. -->
          <div class="map-labels">
            ${h.map((c) => A`
              <img class="map-tile" src=${c.ref} alt="" style=${`left:${c.left}px;top:${c.top}px;width:${c.size}px;height:${c.size}px`} />`)}
          </div>

          <div class="map-pin" style=${`left:${a};top:${o}`}>
            <div class="map-badge">${S(i)}°</div>
            <div class="map-dot"></div>
            <div class="map-here">My Location</div>
          </div>

          ${this._mapOpen ? A`
            <div class="map-legend" @click=${(c) => c.stopPropagation()}>
              <div class="map-legend-title">Precipitation</div>
              <div class="map-legend-body">
                <div class="map-legend-bar"></div>
                <div class="map-legend-labels">
                  <span>Extreme</span><span>Heavy</span>
                  <span>Moderate</span><span>Light</span>
                </div>
              </div>
            </div>
            <div class="map-zoom" @click=${(c) => c.stopPropagation()}>
              <button title="Zoom in" @click=${() => this._zoomBy(1)}
                      ?disabled=${this._zoom >= w.ZOOM_MAX}>
                ${P`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M12 5 V19 M5 12 H19" /></svg>`}
              </button>
              <button title="Zoom out" @click=${() => this._zoomBy(-1)}
                      ?disabled=${this._zoom <= w.ZOOM_MIN}>
                ${P`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M5 12 H19" /></svg>`}
              </button>
            </div>
            <button class="map-close" title="Close"
                    @click=${(c) => {
      c.stopPropagation(), this._toggleMap();
    }}>
              ${P`<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>`}
            </button>
          ` : m}

          ${this._mapOpen && !n?.frames.length ? A`
            <div class="map-bar no-data" @click=${(c) => c.stopPropagation()}>
              <div class="map-bar-text">
                <div class="map-bar-title">Forecast unavailable</div>
                <div class="map-bar-date">
                  ${this._gridRetryAt ? "Open-Meteo daily request limit reached — retrying automatically." : "Loading forecast…"}
                </div>
              </div>
            </div>` : m}

          ${this._mapOpen && n?.frames.length && d ? A`
            <div class="map-bar" @click=${(c) => c.stopPropagation()}>
              <button class="map-play" @click=${this._togglePlayback}
                      title=${this._mapPlaying ? "Pause" : "Play"}>
                ${this._mapPlaying ? "❚❚" : "▶"}
              </button>
              <div class="map-bar-text">
                <div class="map-bar-title">Forecast</div>
                <div class="map-bar-date">
                  ${d.toLocaleDateString(s, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    })}
                </div>
              </div>
              <div class="map-range">
                <button class=${this._mapRange === "1h" ? "on" : ""}
                        @click=${() => this._setRange("1h")}>1h</button>
                <button class=${this._mapRange === "12h" ? "on" : ""}
                        @click=${() => this._setRange("12h")}>12h</button>
              </div>
              <div class="map-track" @pointerdown=${this._scrub}>
                <!-- Width is set by _syncMapBar(), never bound here — see the
                     note on that method. -->
                <div class="map-track-fill"></div>
              </div>
              <div class="map-ticks">
                ${n.times.map((c, u) => {
      const y = this._mapRange === "1h";
      return !y && u % 2 !== 0 ? m : A`<span>
                    ${u === 0 ? "Now" : this._timeLabel(new Date(c), y)}
                  </span>`;
    })}
              </div>
            </div>` : m}

          ${!e && !this._mapOpen ? A`<div class="map-note">
            ${this._gridRetryAt ? "No forecast" : "Loading…"}
          </div>` : m}
          ${this._mapOpen ? A`<div class="map-credit">${hi}</div>` : m}
        </div>
      </div>
    `;
  }
  /**
   * iOS wind tile: labelled rows on the left, a ticked compass dial on the
   * right. HA's `wind_bearing` is the direction the wind comes FROM, so the
   * arrow is drawn 180° opposite — pointing where the wind is blowing to.
   */
  _renderWindTile(e, t, i, s, a) {
    const r = (D) => (D - 90) * Math.PI / 180, n = (D, R) => [48 + D * Math.cos(R), 48 + D * Math.sin(R)];
    let l = "";
    for (let D = 0; D < 72; D++) {
      const R = D * 5;
      if ([0, 90, 180, 270].some((pe) => Math.abs(((R - pe) % 360 + 540) % 360 - 180) > 168)) continue;
      const ft = r(R), [he, le] = n(31, ft), [de, ce] = n(39, ft);
      l += `M${he.toFixed(2)},${le.toFixed(2)}L${de.toFixed(2)},${ce.toFixed(2)}`;
    }
    const d = a !== void 0, p = d ? a + 180 : 0, h = r(p), c = r(p + 180), u = 38, [y, b] = n(u, c), [g, v] = n(u - 3, c), [_, x] = n(24.5, c), [k, z] = n(22.5, h), [X, tt] = n(30, h), Q = 1.32, et = (u + 2 + 30) / 2, gt = (u + 2 - 30) / 2 * Q, [M, f] = n(et + gt, h), [C, T] = n(et - gt, h), H = -Math.sin(h), ut = Math.cos(h), Y = 3.4 * Q, it = C + H * Y, st = T + ut * Y, oe = C - H * Y, re = T - ut * Y, ne = (D) => {
      const R = Math.abs(((p - D) % 360 + 360) % 360);
      return (R > 180 ? 360 - R : R) < 12;
    }, $t = this._tap("wind");
    return A`
      <div class="tile wide" ?tappable=${!!$t}
           @pointerdown=${this._markPointer} @click=${$t}>
        <div class="tile-head">${V.wind} WIND</div>
        <div class="wind-body">
          <div class="wind-rows">
            <div class="wrow"><span>Wind</span><b>${S(e)} ${t}</b></div>
            <div class="wrow"><span>Gusts</span><b>${S(i)} ${s}</b></div>
          </div>
          <svg class="dial" viewBox="0 0 96 96" aria-hidden="true">
            <path class="dial-ticks" d=${l}></path>
            <!--
              MUST use lit's svg\`\` tag, not html\`\`. A nested html template is
              parsed standalone as HTML, so line/circle/polygon are created in
              the HTML namespace: they appear in the DOM and report computed
              styles, but never render as geometry (getBBox throws). That is
              why the direction arrow was silently invisible.
            -->
            ${d ? P`
              <line class="dial-shaft" x1=${g.toFixed(2)} y1=${v.toFixed(2)}
                    x2=${_.toFixed(2)} y2=${x.toFixed(2)}></line>
              <line class="dial-shaft" x1=${k.toFixed(2)} y1=${z.toFixed(2)}
                    x2=${X.toFixed(2)} y2=${tt.toFixed(2)}></line>
              <circle class="dial-tail" cx=${y.toFixed(2)} cy=${b.toFixed(2)}
                      r=${(3.2 * Q).toFixed(2)}></circle>
              <polygon class="dial-head" points=${`${M.toFixed(2)},${f.toFixed(2)} ${it.toFixed(2)},${st.toFixed(2)} ${oe.toFixed(2)},${re.toFixed(2)}`}></polygon>` : m}
            <!-- Labels and readout draw last so the shaft passes behind them.
                 The letters sit INSIDE the tick ring (r 35, ticks 31-39), so a
                 cardinal-pointing arrow lands right on top of one; both are
                 solid white, and the glyph vanished. The letter the arrow is
                 aimed at is dropped instead — the arrow already occupies that
                 gap in the tick ring and reads as the direction marker. -->
            ${Ci.map(([D, R, Mt, ft]) => d && ne(ft) ? m : P`
                  <text class="dial-card" x=${R} y=${Mt} text-anchor="middle"
                        dominant-baseline="middle">${D}</text>`)}
            <!-- y is in viewBox units: the dial renders at 0.80x the tile
                 width (136px for a 96 unit box), so 1 unit ~ 1.42 screen px.
                 41 -> 42.4 drops the readout the requested 2px. -->
            <text class="dial-val" x="48" y="42.4" text-anchor="middle"
                  dominant-baseline="middle">${S(e)}</text>
            <text class="dial-unit" x="48" y="58" text-anchor="middle"
                  dominant-baseline="middle">${t}</text>
          </svg>
        </div>
      </div>
    `;
  }
};
w.SPRING = "cubic-bezier(0.34, 1.42, 0.64, 1)";
w.FRAME_SECONDS = 0.9;
w.ZOOM_MIN = 8;
w.ZOOM_MAX = 11;
w.ZOOM_KEY = "fruity-weather-card:map-zoom";
w.styles = Me`
    /* Fixed card widths are stated as the OUTER size, so padding and the
       hairline border must sit inside them — otherwise every card overflows its
       grid track by its padding and swallows the gap. */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :host {
      --fwc-font: system-ui, 'SF Pro Display', 'SF Pro Text', Inter,
        'Helvetica Neue', Roboto, sans-serif;
      --fwc-panel: rgba(255, 255, 255, 0.13);
      /* One source for the sheet's fill so its notch cannot drift from it. */
      --sheet-bg: #16161a;
      /* Shared by the day card's temperature scale and its hour row, so the
         two axes always read as one set of labels. */
      --sheet-axis: rgba(255, 255, 255, 0.75);
      /* Same labels once their hour has passed. */
      --sheet-axis-past: rgba(255, 255, 255, 0.34);
      /* Day card header geometry. The date box has a FIXED width so the next
         button never shifts as the date changes length — it is the widest
         string the format can produce (measured: "Wednesday, September 23,
         2026" at 266px in en), plus a little slack. Short dates simply leave
         space before the button rather than dragging it left. A wider locale
         will overflow into the free area on the right, which is the intended
         failure direction; override the token to suit. */
      --daycard-pad-x: 14px;
      --snav-size: 30px;
      --sheet-date-w: 272px;
      --fwc-hairline: rgba(255, 255, 255, 0.14);
      --fwc-dim: rgba(255, 255, 255, 0.62);
      --fwc-dimmer: rgba(255, 255, 255, 0.45);
      /*
       * Card geometry is FIXED; only the column count reflows.
       *
       * 170px is not arbitrary: the reference layout fits SIX tile columns
       * across its width (tile ≈ 15.5% of the layout). At 275px this card only
       * reached three columns on the same screen, which is why it read as
       * bloated next to the reference no matter how correct the internal
       * ratios were.
       */
      --fwc-tile: 170px;
      --fwc-gap: 14px;
      /*
       * Daily-list metrics, also expressed against the tile so they track it.
       * Reference ratios are relative to the LIST width (2 tiles + gap = 564):
       *   row height 95/595 = 16% · day text 30/595 = 5% · bar 10/595 = 1.7%.
       * Restated against one 275px tile: 32.7%, 10.2%, 3.5%.
       */
      --d-row: calc(var(--fwc-tile) * 0.327);
      --d-font: calc(var(--fwc-tile) * 0.102);
      --d-bar: calc(var(--fwc-tile) * 0.035);
      /* ONE condition-icon size shared by the daily list and the hourly strip —
         they were 23px and a hardcoded 38px, which read as two different
         designs. This lands between the two, then 10% smaller twice over. */
      --fwc-icon: calc(var(--fwc-tile) * 0.142);
    }

    /*
     * No background of its own: the dashboard's, or failing that the theme's,
     * shows through. The card used to paint a fixed blue sky here (and a darker
     * variant on .night), which ignored whatever the dashboard was set to.
     *
     * The day/night class is still set on the host — it is what a sun-driven
     * dynamic sky would hang off in v2 — it just paints nothing now.
     */
    ha-card {
      font-family: var(--fwc-font);
      color: var(--primary-text-color, #fff);
      border: none;
      border-radius: 20px;
      padding: 0 12px 14px;
      /* visible so the hero artwork can bleed past the card box when a host
         (the tablet pop-up) sets --fwc-hero-bleed-*; nothing else paints at
         the card edge, since the card has no background, border or shadow. */
      overflow: visible;
      background: none;
      box-shadow: none;
    }

    .err { padding: 16px; color: var(--error-color, #ff6b6b); }

    /* ---- day-detail sheet ---- */
    /* Covers the card rather than the viewport: the card is often hosted in a
       pop-up that owns the screen, and a second full-screen layer inside it
       fights the host's own backdrop and scroll lock. */
    /*
     * The day card lives IN the grid: three columns beside the daily list, the
     * same two rows tall, so the tiles simply flow after it. Nothing overlays
     * anything, so its position is fixed and only the notch moves.
     */
    .daycard {
      position: relative;
      /*
       * EXPLICIT placement, never auto. As an auto-placed 3x2 item under dense
       * auto-flow the browser first resolved it into the bottom
       * row and only later settled it beside the daily list, so on every open
       * the card and the tiles visibly swapped places and swapped back — the
       * flicker at each end of the shuffle. The daily list is two columns wide
       * and starts at line 1, so this card starts at line 3, always.
       */
      grid-column: 3 / span 3;
      grid-row: 1 / span 2;
      height: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
      /*
       * min-height:auto is the default for a grid item, which means its CONTENT
       * can push the row taller than the height above. While the hourly data
       * was loading the body briefly measured taller than two rows, the grid
       * grew by a whole row, and every tile jumped down and back — the flicker
       * at each end of the shuffle. Pinning min-height to 0 and clipping makes
       * the declared height authoritative.
       */
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: 10px var(--daycard-pad-x) 12px;
      border-radius: 18px;
      background: var(--sheet-bg);
      border: 0.5px solid var(--fwc-hairline);
      transform-origin: left center;
      animation: daycard-in 420ms cubic-bezier(0.34, 1.42, 0.64, 1);
    }
    /* Below the breakpoint there is no room for three columns beside a
       two-column list, so the card becomes a full-width block instead. */
    @media (max-width: 620px) {
      .daycard { grid-column: 1 / -1; grid-row: auto / span 2; }
    }
    /* Grows out of the daily list it belongs to rather than blinking into
       existence, on the same spring the reflowing tiles use. */
    @keyframes daycard-in {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .daycard { animation: none; }
      .sheet-arrow { transition: none !important; }
    }
    /*
     * The notch that ties the card to its row. An SVG rather than the usual CSS
     * border triangle: that trick cannot carry a stroke, and faking one with a
     * second triangle behind it left the fill and the card drifting to
     * different darks. Here the fill reads the SAME custom property the card
     * paints with, and only the two slanted sides are stroked, so the notch is
     * literally an extension of the card's own edge. Its top is set by script.
     */
    .sheet-arrow {
      position: absolute;
      left: -26px;
      width: 26px;
      height: 36px;
      transform: translateY(-50%);
      overflow: visible;
      transition: top 420ms cubic-bezier(0.34, 1.42, 0.64, 1);
    }
    .sheet-arrow polygon { fill: var(--sheet-bg); }
    .sheet-arrow polyline {
      fill: none;
      stroke: rgba(255, 255, 255, 0.26);
      stroke-width: 1;
      stroke-linejoin: round;
    }

    /* The stage clips nothing itself — the card's own overflow does that — but
       it gives the outgoing clone something to be absolutely positioned in. */
    .sheet-stage { position: relative; flex: 1 1 auto; min-height: 0; }
    .sheet-body { display: flex; flex-direction: column; }
    .sheet-body.ghost { position: absolute; top: 0; left: 0; width: 100%; pointer-events: none; }
        /* Typography below is matched to its counterpart in the daily list, so the
       two cards read as one: date to .dday, the scale to .dlo, the hour row to
       .dhi. Sizes come from the same --d-font token rather than being restated. */
    /* Sized to occupy exactly the row the nav buttons sit on, and indented past
       the previous-day button. It belongs to the sliding body rather than to a
       nav row so that it travels with the day it names, while the buttons —
       chrome, not content — stay put; that is why they are positioned out of
       flow above. The header is packed to the left, leaving the right of the
       row free for further controls. */
    .sheet-date {
      height: var(--snav-size);
      display: flex;
      align-items: center;
      /* Centred in its reserved box, not left-aligned in it: the box is a fixed
         width so the next button cannot move, and parking all of that slack on
         one side left a lopsided gap before the button. Centred, the two gaps
         match and the header reads as one deliberate group. */
      justify-content: center;
      margin-left: calc(var(--snav-size) + 10px);
      width: var(--sheet-date-w);
      font-size: var(--d-font);
    }
    .snav {
      position: absolute;
      top: 10px;
      z-index: 1;
      display: grid;
      place-items: center;
      width: var(--snav-size);
      height: var(--snav-size);
      border: none;
      border-radius: 9px;
      cursor: pointer;
      color: inherit;
      background: rgba(255, 255, 255, 0.1);
    }
    .snav.prev { left: var(--daycard-pad-x); }
    /* Sits just past the date box. Both read the same width token, so the
       button and the space reserved for the date cannot drift apart. */
    .snav.next {
      left: calc(var(--daycard-pad-x) + var(--snav-size) + 10px + var(--sheet-date-w) + 10px);
    }
    .snav[disabled] { opacity: 0.3; cursor: default; }
    .snav svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

    .sheet-hilo {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 14px;
      font-size: 34px;
      font-weight: 500;
      letter-spacing: -0.5px;
    }
    .sheet-lo { color: var(--fwc-dim); }
    /* 30% over the strip's glyph size: beside 34px digits the standard icon
       reads undersized, and this is the one place the two sit together. */
    .sheet-cond {
      width: calc(var(--fwc-icon) * 1.3);
      height: calc(var(--fwc-icon) * 1.3);
      object-fit: contain;
      margin-left: 6px;
    }
    .sheet-unit { font-size: calc(var(--d-font) * 0.85); color: var(--fwc-dim); margin-top: 1px; }

    .sheet-glyphs {
      position: relative;
      height: var(--fwc-icon);
      margin: 12px 42px 2px 0;
    }
    .sglyph {
      position: absolute;
      transform: translateX(-50%);
      width: var(--fwc-icon);
      height: var(--fwc-icon);
      object-fit: contain;
    }
    .sheet-chart { display: flex; height: 150px; }
    .sheet-plot { position: relative; flex: 1 1 auto; }
    .sgl {
      position: absolute;
      left: 0;
      right: 0;
      border-top: 0.5px solid rgba(255, 255, 255, 0.1);
    }
    .scurve { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .scurve polyline {
      fill: none;
      stroke: #f0a93b;
      stroke-width: 4;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    /* The elapsed part of today. Round caps grow a dash by half the stroke
       width at each end, so the dasharray is stated in the pre-cap geometry:
       4 and 9 paint as an 8px capsule with a 5px gap. The non-scaling-stroke
       vector-effect is what keeps that in screen pixels — the viewBox is
       stretched to the plot, so a plain dasharray would be squashed
       horizontally. */
    .scurve polyline.past {
      stroke: rgba(255, 255, 255, 0.4);
      stroke-dasharray: 4 9;
    }
    .now-line {
      position: absolute;
      top: calc(-1 * (var(--fwc-icon) + 2px));
      bottom: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.16);
      pointer-events: none;
    }
    .sglyph.past { opacity: 0.42; }
    /* The meridiem is its own span and so carries its own colour declaration —
       it does not inherit the dimmed one from the label around it. */
    .sheet-xaxis span.past, .sheet-xaxis span.past .ap { color: var(--sheet-axis-past); }
    .smark.past { background: rgba(255, 255, 255, 0.5); }
    .smark {
      position: absolute;
      width: 11px;
      height: 11px;
      margin: -5.5px 0 0 -5.5px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
    }
    .smark span {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: var(--d-font);
      color: var(--fwc-dimmer);
      /* These sit over the fill at one end of the curve and over the card at
         the other, so neither a light nor a dark colour alone stays legible.
         A soft dark halo — wide and diffuse rather than a tight outline, which
         read as a hard edge — darkens whatever is behind the glyph without
         changing its colour, which is matched to the temperature scale. The
         smallest radius is deliberately large and the middle one is repeated:
         stacking layers deepens the shade without adding a crisp edge, which is
         how it gets darker AND softer at once rather than trading one for the
         other. */
      text-shadow:
        0 0 9px rgba(0, 0, 0, 0.9),
        0 0 16px rgba(0, 0, 0, 0.85),
        0 0 16px rgba(0, 0, 0, 0.7),
        0 0 26px rgba(0, 0, 0, 0.75),
        0 0 38px rgba(0, 0, 0, 0.5);
    }
    .smark.hi span { bottom: 13px; }
    .smark.lo span { top: 13px; }
    .smark.hi.flip span { bottom: auto; top: 13px; }
    .smark.lo.flip span { top: auto; bottom: 13px; }
    .sheet-yaxis { position: relative; width: 42px; flex: none; }
    .sheet-yaxis span {
      position: absolute;
      right: 0;
      transform: translateY(-50%);
      font-size: var(--d-font);
      font-variant-numeric: tabular-nums;
      color: var(--sheet-axis);
    }
    .sheet-xaxis {
      position: relative;
      height: 18px;
      /* Dropped clear of the plot: an L marker sitting on the bottom gridline
         was crowding the hour beneath it. */
      margin: 11px 42px 0 0;
    }
    .sheet-xaxis span {
      position: absolute;
      transform: translateX(-50%);
      font-size: var(--d-font);
      color: var(--sheet-axis);
      white-space: nowrap;
    }
    /* Between the sunrise/sunset tile's proportion (0.67), which read too small
       here, and a 2px drop, which barely read at all. */
    .sheet-xaxis .ap {
      position: static;
      transform: none;
      font-size: calc(var(--d-font) * 0.75);
    }
    /* Edge labels are pinned inward; centred on 0% or 100% half of each would
       fall outside the sheet's padding box and be clipped. */
    .sheet-xaxis span.first, .sglyph.first { transform: none; }
    .sheet-xaxis span.last { transform: translateX(-100%); }
    .sglyph.last { transform: translateX(-100%); }
    .sheet-note {
      padding: 26px 0 10px;
      text-align: center;
      font-size: 14px;
      color: var(--fwc-dim);
    }
    /* Scrub readout — replaces the H/L block while a finger is on the curve. */
    /*
     * The readout rides along under the cursor, as in the reference: caption
     * over value, translated horizontally by script. A transform is used rather
     * than a margin or an absolute position so it costs no layout and the block
     * keeps reserving its own height — that is what stops the sheet resizing
     * as a finger crosses the curve.
     */
    /*
     * inline-block in BOTH states, never only while scrubbing. Two reasons:
     * its width must equal its content width or there is nothing to slide
     * under the cursor, and — the subtle one — inline-block establishes a block
     * formatting context, which CONTAINS the child's margin-top instead of
     * letting it collapse out. Switching display between states therefore
     * changed the readout's height by that margin, which used to move the whole
     * sheet. Same box model in both states, no jump.
     */
    .sheet-readout {
      /*
       * align-self, NOT display:inline-block — the day card is a flex column and
       * flex items are BLOCKIFIED, so inline-block silently computed to block,
       * the readout filled the card's width, and the tracking clamp pinned it to
       * the left edge. Cross-axis start sizing gives it its content width, which
       * is what makes it slidable. Flex items never collapse margins either, so
       * the height stays stable between states for free.
       */
      align-self: flex-start;
      transform: translateX(0);
    }
    .sheet-readout.scrubbing { will-change: transform; }
    .scrub-temp { font-size: 34px; font-weight: 500; letter-spacing: -0.5px; }
    .sheet-hilo.scrubbing { display: flex; align-items: center; }
    .sheet-hilo.scrubbing .sheet-cond { margin-left: 0; margin-right: 2px; }
    /* Climbs out of the plot, past the glyph row, to meet the readout it is
       driving — the plot sets no overflow, so the overhang paints. The offset
       is the glyph row plus its margins, kept in the same terms as they are. */
    .scrub-line {
      position: absolute;
      top: calc(-1 * (var(--fwc-icon) + 12px));
      bottom: 0;
      width: 0;
      border-left: 3px solid #fff;
      pointer-events: none;
    }
    .scrub-dot {
      position: absolute;
      width: 16px;
      height: 16px;
      margin: -8px 0 0 -8px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
      pointer-events: none;
    }
    /* The plot owns the gesture, so a drag across it must not also pan the
       pop-up it lives in. */
    .sheet-plot { touch-action: none; cursor: crosshair; }
    .sheet-retry {
      margin-left: 8px;
      padding: 3px 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font: inherit;
      color: inherit;
      background: rgba(255, 255, 255, 0.14);
    }
    .drow[tappable] { cursor: pointer; }
    .drow[tappable]:active { filter: brightness(1.12); }

    /* ---- hero ---- */
    /*
     * The scene artwork bleeds past the hero's content box by
     * --fwc-hero-bleed-x / -top, so a host can push it out to its own edge:
     * the tablet pop-up sets 30px/24px to clear the card's 12px padding plus
     * the pop-up's 18px/24px padding. Padding grows by the same amount the
     * margin pulls back, so the text never moves. Defaults reach the card edge.
     * z-index:0 makes .hero a stacking context so ::before sits behind the text.
     */
    .hero {
      text-align: center;
      padding: calc(18px + var(--fwc-hero-bleed-top, 0px))
               var(--fwc-hero-bleed-x, 12px)
               calc(20px + var(--fwc-hero-extend, 0px));
      margin: calc(-1 * var(--fwc-hero-bleed-top, 0px))
              calc(-1 * var(--fwc-hero-bleed-x, 12px)) 0;
      position: relative;
      z-index: 0;
    }
    .hero.has-bg::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background-image: var(--fwc-hero);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      opacity: 0.8;
      /* Match whatever rounds the host's top corners (42px in the pop-up). */
      border-radius: var(--fwc-hero-radius, 20px) var(--fwc-hero-radius, 20px) 0 0;
      /* Fade out into the card instead of ending on a hard horizontal edge. */
      -webkit-mask-image: linear-gradient(to bottom,
        #000 45%,
        rgba(0, 0, 0, 0.98) 50%, rgba(0, 0, 0, 0.91) 55%,
        rgba(0, 0, 0, 0.81) 60%, rgba(0, 0, 0, 0.69) 65%,
        rgba(0, 0, 0, 0.57) 70%, rgba(0, 0, 0, 0.43) 75%,
        rgba(0, 0, 0, 0.31) 80%, rgba(0, 0, 0, 0.19) 85%,
        rgba(0, 0, 0, 0.10) 90%, rgba(0, 0, 0, 0.03) 95%,
        transparent 100%);
      mask-image: linear-gradient(to bottom,
        #000 45%,
        rgba(0, 0, 0, 0.98) 50%, rgba(0, 0, 0, 0.91) 55%,
        rgba(0, 0, 0, 0.81) 60%, rgba(0, 0, 0, 0.69) 65%,
        rgba(0, 0, 0, 0.57) 70%, rgba(0, 0, 0, 0.43) 75%,
        rgba(0, 0, 0, 0.31) 80%, rgba(0, 0, 0, 0.19) 85%,
        rgba(0, 0, 0, 0.10) 90%, rgba(0, 0, 0, 0.03) 95%,
        transparent 100%);
    }
    /* Diffuse haze rather than an offset shadow: an offset reads as a drop
       shadow and its hard edge shows as an outline around every glyph. */
    .hero.has-bg .loc,
    .hero.has-bg .cond,
    .hero.has-bg .hilo {
      text-shadow: 0 0 14px rgba(0, 0, 0, 0.85), 0 0 28px rgba(0, 0, 0, 0.55);
    }
    .hero.has-bg .temp {
      text-shadow: 0 0 24px rgba(0, 0, 0, 0.85), 0 0 48px rgba(0, 0, 0, 0.55);
    }
    .loc { font-size: 30px; font-weight: 400; letter-spacing: 0.2px; }
    .temp {
      font-size: 88px;
      font-weight: 200;
      line-height: 1.02;
      letter-spacing: -3px;
      margin-left: 14px; /* optically centre the glyphs, not the degree sign */
    }
    .temp .deg { font-weight: 200; }
    .cond { font-size: 19px; color: var(--fwc-dim); margin-top: 2px; }
    .hilo { font-size: 19px; margin-top: 1px; }

    /* ---- shared panel ---- */
    .panel {
      background: var(--fwc-panel);
      border-radius: 16px;
      border: 0.5px solid var(--fwc-hairline);
      padding: 10px 12px 12px;
    }
    .panel-head {
      /* Same 6.9%-of-tile ratio as a tile heading, so the two read alike. */
      font-size: calc(var(--fwc-tile) * 0.069);
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--fwc-dim);
      padding-bottom: 10px;
      border-bottom: 0.5px solid var(--fwc-hairline);
      margin-bottom: 2px;
    }

    /* ---- hourly strip ---- */
    .strip { margin-bottom: var(--fwc-gap); }
    .strip-summary {
      font-size: calc(var(--fwc-tile) * 0.088);
      line-height: 1.3;
      padding: 2px 2px 10px;
      border-bottom: 0.5px solid var(--fwc-hairline);
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .row::-webkit-scrollbar { display: none; }
    .cell {
      flex: 0 0 auto;
      min-width: calc(var(--fwc-tile) * 0.40);
      text-align: center;
      padding: 2px 0;
    }
    /* Sized DOWN from the daily list: the strip is far wider than the daily
       panel, so type at the list's own size reads oversized across it. */
    .cell-label {
      font-size: calc(var(--d-font) * 0.85);
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
    }
    /* em-relative so the period marker stays ~2px under the hour at any size. */
    .cell-label .ap { font-size: 0.82em; }
    .cell-icon {
      width: var(--fwc-icon);
      height: var(--fwc-icon);
      display: block;
      /* 3px, plus 2px of breathing room above and below so the glyph is not
         crowded between the hour and the temperature. */
      margin: 5px auto;
    }
    /* The sunrise/sunset caption is deliberately NOT dimmed or shrunk: it reads
       as one continuous row of labels with the hourly temperatures. */
    .cell-val { font-size: calc(var(--d-font) * 0.92); font-weight: 600; }

    /* ---- two-column body ---- */
    /*
     * Cards are a FIXED size; only the arrangement is responsive. The track
     * size is a literal length (not 1fr and not a minmax), so auto-fill changes
     * the COLUMN COUNT as the card resizes and never rescales a card. If even
     * one column will not fit, the grid scrolls horizontally rather than
     * shrinking anything. Daily list and wind span two columns, as in iOS.
     */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, var(--fwc-tile));
      gap: var(--fwc-gap);
      /* Flush left: the daily list pins to the card edge and the squares flow
         out from it, rather than the whole block floating in the middle. */
      justify-content: start;
      align-items: start;
      align-content: start;
      /* dense lets single tiles backfill the column beside the tall daily list
         instead of leaving a hole under it. */
      grid-auto-flow: row dense;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .daily,
    .tile.wide,
    .tile.map {
      grid-column: span 2;
      width: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
    }
    /* Same footprint as the daily list: two columns by two rows.
       NOTE: no padding-bottom override here. It used to be 0, which ran the map
       to the tile's bottom edge while the sides kept 14px — measured 15/15/1. */
    .tile.map {
      /*
       * A FIXED cell, so opening the day card reflows everything around the
       * radar instead of dragging the largest tile across the grid. Static
       * rather than pinned from script: an earlier dynamic pin rewrote the
       * spans below with its own read-back value and degraded them to span 1,
       * which let this 354px tile sit in a 170px cell and overlap its
       * neighbours. The .open rule is more specific and still wins.
       */
      grid-column: 1 / span 2;
      grid-row: 3 / span 2;
      height: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
    }
    /*
     * Expanded: the map claims every column and four rows. The grid uses
     * grid-auto-flow row dense, so the tiles it displaces reflow underneath on
     * their own rather than leaving a hole. (Never put a backtick in here: it
     * closes the css tagged template, and the error points at the wrong line.)
     */
    /*
     * Expanded is the FULL WIDTH of the grid and three tiles tall. Placed
     * 1 / -1 rather than span N so it adapts to whatever column count the card
     * is rendered at; width 100% then resolves against the spanned area, and
     * Chrome still interpolates the 354px -> 100% transition.
     */
    .tile.map.open {
      grid-column: 1 / -1;
      grid-row: span 3;
      width: 100%;
      height: calc(var(--fwc-tile) * 3 + var(--fwc-gap) * 2);
      cursor: default;
    }
    /*
     * Open/close springs past the target and settles — the standard iOS
     * easing. Grid PLACEMENT cannot be transitioned, only the box, so any
     * displaced neighbours are animated separately by the FLIP pass in
     * _toggleMap(); both run over the same duration so they read as one move.
     *
     * The map is deliberately the LAST tile in the grid, so in practice there
     * is nothing after it to displace and the FLIP pass is a no-op. That is the
     * point: the user found the reshuffle "extremely confusing". The FLIP code
     * stays because a narrow card can still wrap a tile past the map.
     */
    .tile.map {
      transition:
        width 420ms cubic-bezier(0.34, 1.42, 0.64, 1),
        height 420ms cubic-bezier(0.34, 1.42, 0.64, 1);
    }
    @media (prefers-reduced-motion: reduce) {
      .tile.map { transition: none; }
    }
    .tile.map { cursor: pointer; }
    /* Expanded drops the heading, so the inset is uniform on all four sides
       rather than the 12px top / 14px sides a headed tile uses. */
    .tile.map.open { padding: 14px; }
    .tile.map.open .tile-head { display: none; }
    .tile.map.open .map-frame { margin-top: 0; }
    /*
     * Map chrome palette. Every legend, pill and button below reads from these
     * so the whole overlay follows the basemap shade in one place — Esri
     * publishes Gray Canvas as Light and Dark, and a light-grey control panel
     * floating over the dark map looked like a leftover.
     */
    .tile.map {
      --m-ground: #e9edf2;      /* shown until the tiles arrive */
      --m-panel: rgba(247, 249, 252, 0.985);
      --m-chip: rgba(210, 215, 224, 0.92);
      --m-chip-on: #fff;
      --m-ink: rgba(25, 32, 48, 0.92);
      --m-ink-2: rgba(40, 48, 66, 0.78);
      --m-ink-3: rgba(40, 48, 66, 0.45);
      /* The timeline labels are the one thing read WHILE scrubbing, so they
         run at full contrast rather than sharing the secondary ink. */
      --m-tick: rgba(8, 12, 20, 1);
      --m-glyph: rgba(8, 12, 20, 0.9);
      --m-rule: rgba(120, 130, 150, 0.28);
      --m-shadow: rgba(20, 30, 50, 0.16);
      --m-halo: #fff;           /* text-shadow behind the pin label */
    }
    .tile.map.dark {
      --m-ground: #2f3237;
      --m-panel: rgba(30, 33, 40, 0.955);
      --m-chip: rgba(70, 76, 88, 0.92);
      --m-chip-on: rgba(122, 130, 146, 0.95);
      --m-ink: rgba(240, 243, 250, 0.95);
      --m-ink-2: rgba(220, 226, 240, 0.78);
      --m-ink-3: rgba(225, 232, 245, 0.45);
      --m-tick: #fff;
      --m-glyph: rgba(250, 252, 255, 0.95);
      --m-rule: rgba(150, 160, 180, 0.26);
      --m-shadow: rgba(0, 0, 0, 0.4);
      --m-halo: rgba(18, 20, 25, 0.95);
    }
    /* Inset frame with its own radius, as in the reference — the map does not
       bleed to the tile edge, it sits inside it like a photo. */
    .map-frame {
      position: relative;
      flex: 1 1 auto;
      margin: 8px 0 0;
      border-radius: 12px;
      overflow: hidden;
      background: var(--m-ground);
      contain: paint;
    }
    .map-base,
    .map-labels { position: absolute; inset: 0; pointer-events: none; }
    /* Size comes from the tile record, not CSS — see baseTiles(). */
    .map-tile { position: absolute; }
    /* The blur is what turns a 27x17 sample grid into the reference's soft
       blobs; without it the bilinear upscale shows facets. */
    .map-heat {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      filter: blur(9px);
    }
    .map-credit {
      position: absolute;
      right: 6px;
      bottom: 2px;
      z-index: 2;
      font-size: 9px;
      color: var(--m-ink-3);
      pointer-events: none;
    }
    .map-pin {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    }
    .map-badge {
      background: rgba(72, 92, 130, 0.92);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      line-height: 1;
      padding: 6px 9px;
      border-radius: 999px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    }
    .map-dot {
      width: 7px;
      height: 7px;
      margin-top: 3px;
      border-radius: 50%;
      background: #fff;
      border: 1.5px solid rgba(60, 70, 95, 0.75);
    }
    .map-here {
      margin-top: 2px;
      font-size: 11px;
      font-weight: 600;
      color: var(--m-ink);
      white-space: nowrap;
      /* Three stacked shadows, not one: the label sits directly on the map and
         needs to survive both pale land and a saturated rain blob. */
      text-shadow: 0 0 3px var(--m-halo), 0 0 3px var(--m-halo), 0 0 2px var(--m-halo);
    }
    /* A small pill, not a full-frame overlay — the basemap is fine, it is only
       the forecast layer that is missing. */
    .map-note {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      padding: 5px 12px;
      border-radius: 999px;
      background: var(--m-panel);
      box-shadow: 0 1px 5px var(--m-shadow);
      font-size: 12px;
      font-weight: 600;
      color: var(--m-ink-2);
      white-space: nowrap;
    }
    .map-bar.no-data {
      grid-template-columns: 1fr;
      grid-template-areas: 'text';
    }

    /* ---- expanded chrome ---- */
    .map-legend {
      position: absolute;
      left: 10px;
      top: 10px;
      background: var(--m-panel);
      border-radius: 14px;
      padding: 11px 14px 13px;
      z-index: 3;
      box-shadow: 0 1px 6px var(--m-shadow);
      color: var(--m-ink);
    }
    /*
     * Proportions taken off the reference: a tall bar with the four labels
     * spread the full height, not a short chip with the names bunched at the
     * top. Height is a fraction of the tile so it tracks the rest of the card.
     */
    .map-legend-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--m-ink);
    }
    .map-legend-body { display: flex; gap: 11px; }
    .map-legend-bar {
      width: 6px;
      border-radius: 3px;
      /* 0.88 read as over-stretched; 20% shorter. */
      height: calc(var(--fwc-tile) * 0.704);
      background: linear-gradient(to top, ${vi});
    }
    .map-legend-labels {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 500;
      color: var(--m-ink-2);
      line-height: 1.2;
      padding: 1px 0;
    }
    .map-close,
    .map-play,
    .map-range button {
      font: inherit;
      border: 0;
      cursor: pointer;
      color: var(--m-ink);
      background: var(--m-chip);
    }
    /* Same diameter and fill as the play button — it was a 30px near-invisible
       chip before — and the X is drawn as a stroked path so it can be properly
       heavy and high-contrast rather than relying on a font glyph. */
    .map-close {
      position: absolute;
      box-shadow: 0 1px 5px var(--m-shadow);
      right: 10px;
      top: 10px;
      z-index: 3;
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--m-chip);
      line-height: 0;
    }
    /* Stacked +/- pill, mirroring the close button's treatment. */
    .map-zoom {
      position: absolute;
      right: 10px;
      top: 56px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      border-radius: 19px;
      overflow: hidden;
      background: var(--m-chip);
      box-shadow: 0 1px 5px var(--m-shadow);
    }
    .map-zoom button {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border: 0;
      background: transparent;
      cursor: pointer;
      line-height: 0;
    }
    .map-zoom button + button { border-top: 1px solid var(--m-rule); }
    .map-zoom button[disabled] { opacity: 0.35; cursor: default; }
    .map-zoom svg,
    .map-close svg {
      fill: none;
      stroke: var(--m-glyph);
      stroke-width: 2.6;
      stroke-linecap: round;
    }
    .map-bar {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 10px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-areas: 'play text range' 'track track track' 'ticks ticks ticks';
      align-items: center;
      gap: 8px 12px;
      padding: 10px 14px 12px;
      border-radius: 16px;
      background: var(--m-panel);
      z-index: 3;
      box-shadow: 0 2px 10px var(--m-shadow);
      color: var(--m-ink);
    }
    .map-play {
      grid-area: play;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      font-size: 13px;
      background: var(--m-chip);
    }
    .map-bar-text { grid-area: text; }
    .map-bar-title { font-size: 15px; font-weight: 700; line-height: 1.15; }
    .map-bar-date { font-size: 13px; color: var(--m-ink-2); }
    .map-range {
      grid-area: range;
      display: flex;
      gap: 2px;
      padding: 2px;
      border-radius: 999px;
      background: var(--m-chip);
    }
    .map-range button {
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      background: transparent;
    }
    .map-range button.on { background: var(--m-chip-on); }
    .map-track {
      grid-area: track;
      height: 5px;
      border-radius: 3px;
      background: var(--m-rule);
      cursor: pointer;
    }
    .map-track-fill {
      height: 100%;
      border-radius: 3px;
      background: var(--m-ink);
    }
    .map-ticks {
      grid-area: ticks;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      color: var(--m-tick);
    }
    /*
     * The daily list claims two grid rows, and its height is pinned to EXACTLY
     * two tiles plus one gap. Without that pin its natural height overshot the
     * two rows, both rows grew to absorb the difference, and the vertical gaps
     * between squares ended up ~17px wider than the horizontal ones. Rows flex
     * to share whatever space is left, so any number of forecast days fits.
     */
    .daily {
      grid-row: span 2;
      height: calc(var(--fwc-tile) * 2 + var(--fwc-gap));
      display: flex;
      flex-direction: column;
    }
    .daily .drow {
      flex: 1 1 0;
      height: auto;
      min-height: 0;
    }
    @media (max-width: 640px) {
      .columns { grid-template-columns: minmax(0, 1fr); }
    }

    /* ---- daily list ---- */
    /*
     * Column split measured off the reference row: day 25% · icon 11% ·
     * low 14% · bar 25% · high 25% of the list's inner width. The bar must NOT
     * be a 1fr track — letting it absorb the slack made it 2.5x too long and
     * left the row looking stretched and empty.
     */
    /*
     * The bar column now spans the WHOLE gap between the low and high temps and
     * the track is centred inside it. Previously the bar column started at the
     * low temp and all the slack piled up before the high temp, so the track
     * sat hard left instead of centred between the two readings.
     */
    /*
     * Icon column position, measured rather than guessed. Each row is its own
     * grid, so the column cannot shrink-wrap the widest weekday — one fixed x
     * has to serve every row, and the true midpoint between the day text and
     * the low temperature moves with the label ("Today" 105px, "Fri" 92px).
     * 26% is the mean of all six rows, i.e. the least-squares centre: worst
     * case is ~8px off instead of 20px. The low column still ENDS at 50% and
     * .dlo is right-aligned, so no text moves — only the icon.
     */
    .drow {
      display: grid;
      grid-template-columns: 20.5% 11% 18.5% 39% 11%;
      align-items: center;
      height: var(--d-row);
      border-bottom: 0.5px solid var(--fwc-hairline);
    }
    .drow:last-child { border-bottom: none; }
    .dday { font-size: var(--d-font); }
    /* A flat 5px nudge on top of the column centring, by eye rather than by
       measurement: the least-squares centre reads slightly left on the "Today"
       row, which is the one the eye lands on first. Absolute, not a percentage,
       so it does not scale with the tile. */
    .dicon {
      width: var(--fwc-icon);
      height: var(--fwc-icon);
      justify-self: center;
      transform: translateX(5px);
    }
    .dlo {
      font-size: var(--d-font);
      color: var(--fwc-dimmer);
      text-align: right;
    }
    .dhi { font-size: var(--d-font); text-align: right; }
    .track {
      position: relative;
      /* 63% of a 39% column = 24.6% of the row, matching the reference bar
         length; auto side margins centre it between the two temperatures. */
      width: 63%;
      margin: 0 auto;
      height: var(--d-bar);
      border-radius: calc(var(--d-bar) / 2);
      background: rgba(255, 255, 255, 0.18);
    }
    .bar {
      position: absolute;
      top: 0;
      height: var(--d-bar);
      border-radius: calc(var(--d-bar) / 2);
    }
    .dot {
      position: absolute;
      top: 50%;
      width: calc(var(--d-bar) * 1.7);
      height: calc(var(--d-bar) * 1.7);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.3);
    }

    /* ---- tiles ---- */
    /*
     * Two fixed sizes, one per device class — the same thing iOS does between
     * iPad and iPhone. Within a class nothing rescales.
     */
    @media (max-width: 620px) {
      :host {
        /* Sized so two columns (plus a 2-wide daily) fit a 390px phone. */
        --fwc-tile: 155px;
        --fwc-gap: 10px;
      }
      /* Nothing else to restate — every metric is derived from --fwc-tile. */
      .wind-body { gap: 10px; }
    }
    /*
     * Every square shares ONE set of type tokens so no tile can drift, and the
     * sizes are the literal reference values measured off a 275px iOS tile.
     */
    .tile {
      /*
       * Derived from the tile width so the RATIOS are exact by construction and
       * cannot drift when --fwc-tile changes. Percentages measured off the
       * reference screenshot at its native 275px tile:
       *   heading 19px = 6.9% · value 58px = 21% · bold sub 26px = 9.5% ·
       *   note 22px = 8%.
       */
      --t-head: calc(var(--fwc-tile) * 0.069);
      --t-value: calc(var(--fwc-tile) * 0.21);
      --t-sub: calc(var(--fwc-tile) * 0.095);
      --t-note: calc(var(--fwc-tile) * 0.08);
      width: var(--fwc-tile);
      height: var(--fwc-tile);
      background: var(--fwc-panel);
      border: 0.5px solid var(--fwc-hairline);
      border-radius: 18px;
      padding: 12px 14px 14px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    /*
     * Only regions with a configured tap_action are interactive, so the cursor
     * and the press feedback are driven off the same attribute the handler is.
     * The map tile is excluded — it is always tappable and expands in place.
     */
    [tappable] { cursor: pointer; }
    [tappable]:active { filter: brightness(1.12); }
    .tile-head {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: var(--t-head);
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--fwc-dim);
      margin-bottom: 10px;
    }
    .thead-icon { width: 16px; height: 16px; flex: 0 0 auto; }
    /* Units are set at FULL value size in iOS ("0 mm", "66%") — only the
       AM/PM period marker is reduced. */
    .tile-value {
      font-size: var(--t-value);
      font-weight: 400;
      letter-spacing: -0.6px;
      line-height: 1.06;
      white-space: nowrap;
    }
    .tile-sub { font-size: var(--t-sub); font-weight: 700; margin-top: 1px; }
    .tile-value.time .digits { font-size: var(--t-value); font-weight: 400; }
    .tile-value.time .ampm {
      font-size: 24px;
      font-weight: 500;
      margin-left: 1px;
    }

    /* ---- sunrise / sunset arc ---- */
    /* Negative margins bleed the horizon to the tile edges, as iOS does. */
    .sunarc { position: relative; flex: 1; min-height: 0; margin: 6px -14px 8px; }
    .sunarc svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    /* non-scaling-stroke keeps the line even once the viewBox is stretched. */
    /*
     * Below the horizon the arc goes DARKER THAN THE TILE, not merely dimmer.
     * That inversion is the whole read of the reference: the curve is lit while
     * the sun is up and in shadow once it is down. A translucent-white night
     * stroke keeps it lighter than its surroundings whatever the alpha, so it
     * never stops looking like the daytime line turned down.
     *
     * Black-on-alpha rather than a fixed colour so it darkens whatever theme
     * background shows through the panel.
     */
    .arc-night {
      fill: none;
      stroke: rgba(0, 0, 0, 0.45);
      stroke-width: 2.8;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
    .arc-day {
      fill: none;
      stroke: rgba(255, 255, 255, 0.72);
      stroke-width: 2.8;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
    }
    .horizon {
      position: absolute;
      left: 0;
      right: 0;
      top: 59.09%; /* horizon y=26 of the 44-unit viewBox */
      /* The day/night divider is a HAIRLINE — it was the arc that needed
         weight, not this. */
      height: 1px;
      background: rgba(255, 255, 255, 0.9);
    }
    /*
     * The halo is an ADDITIVE bloom, not a box-shadow: plus-lighter lets it
     * brighten whatever sits underneath, so the arc and the horizon line wash
     * to white as they pass behind the sun — exactly what iOS does. A drop
     * shadow would just paint a flat disc on top and look pasted on.
     */
    .sunglow {
      position: absolute;
      width: 120px;
      height: 120px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      pointer-events: none;
      mix-blend-mode: plus-lighter;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.6) 0%,
        rgba(255, 248, 228, 0.34) 15%,
        rgba(255, 244, 214, 0.15) 33%,
        rgba(255, 242, 206, 0.05) 54%,
        rgba(255, 242, 206, 0) 72%
      );
    }
    .sundot {
      position: absolute;
      width: 13px;
      height: 13px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-sizing: border-box;
    }
    /* Above the horizon the sun is a lit disc; the thin dark ring keeps it
       readable inside its own glow. */
    .sundot.up {
      background: #fff;
      box-shadow: 0 0 0 1.5px rgba(18, 24, 46, 0.55);
    }
    /* Below the horizon iOS draws it HOLLOW — an unlit ring, not a lamp. */
    .sundot.down {
      background: rgba(18, 24, 46, 0.9);
      border: 2px solid rgba(255, 255, 255, 0.9);
    }
    /* ...and the bloom drops right back once the sun has set. */
    .sunglow.down {
      width: 76px;
      height: 76px;
      opacity: 0.4;
    }
    .sun-note { font-size: var(--t-note); }
    .sun-note .digits-sm { font-size: var(--t-note); }
    .sun-note .ampm-sm { font-size: 13px; margin-left: 1px; }
    .tile-note {
      margin-top: auto;
      font-size: var(--t-note);
      font-weight: 400;
      line-height: 1.24;
      color: rgba(255, 255, 255, 0.92);
    }

    /* ---- wind ---- */
    /* The iOS wind tile is TWO columns wide: labelled rows on the left, dial on
       the right. Squeezed into one column the two collide, which is why this
       tile carries .wide. */
    .wind-body {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      gap: 18px;
      /* Pulled up so the dial can rise alongside the heading rather than being
         boxed in beneath it — that is what lets it be this large. */
      margin-top: calc(var(--fwc-tile) * -0.11);
    }
    .wind-rows { flex: 1 1 auto; min-width: 0; }
    .wrow {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      /* Same token as every other square's body text, so the wind tile reads
         at the same weight and scale as its neighbours. */
      font-size: var(--t-note);
      padding: calc(var(--fwc-tile) * 0.05) 0;
      border-bottom: 0.5px solid var(--fwc-hairline);
      white-space: nowrap;
    }
    .wrow:last-child { border-bottom: none; }
    /* Reference emphasises the LABEL and dims the value — the opposite of the
       usual convention, and the opposite of what this card did before. */
    .wrow span { color: #fff; font-weight: 600; }
    .wrow b { color: var(--fwc-dim); font-weight: 400; }
    /* Nearly fills the tile's height below the heading, as it does in the
       reference — the previous 0.61 left it looking undersized. */
    .dial {
      flex: 0 0 auto;
      width: calc(var(--fwc-tile) * 0.80);
      height: calc(var(--fwc-tile) * 0.80);
    }
    /* Ticks sit well back so the arrow is the only bright thing on the dial. */
    .dial-ticks { stroke: rgba(255, 255, 255, 0.22); stroke-width: 1; }
    .dial-card { fill: rgba(255, 255, 255, 0.75); font-size: 9.5px; font-weight: 600; }
    .dial-val { fill: #fff; font-size: 18px; font-weight: 600; }
    .dial-unit { fill: rgba(255, 255, 255, 0.6); font-size: 9px; font-weight: 500; }
    .dial-shaft { stroke: #fff; stroke-width: 2.9; stroke-linecap: round; }
    .dial-head { fill: #fff; }
    .dial-tail { fill: #fff; }
  `;
E([
  Zt({ attribute: !1 })
], w.prototype, "hass", 2);
E([
  $()
], w.prototype, "_config", 2);
E([
  $()
], w.prototype, "_hourly", 2);
E([
  $()
], w.prototype, "_daily", 2);
E([
  $()
], w.prototype, "_grid", 2);
E([
  $()
], w.prototype, "_mapOpen", 2);
E([
  $()
], w.prototype, "_mapFrame", 2);
E([
  $()
], w.prototype, "_mapPlaying", 2);
E([
  $()
], w.prototype, "_sheetDay", 2);
E([
  $()
], w.prototype, "_hourScrub", 2);
E([
  $()
], w.prototype, "_hourlyDays", 2);
E([
  $()
], w.prototype, "_hourlyError", 2);
E([
  $()
], w.prototype, "_mapRange", 2);
E([
  $()
], w.prototype, "_mapZoom", 2);
w = E([
  We("fruity-weather-card")
], w);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "fruity-weather-card",
  name: "Fruity Weather Card",
  description: "iOS-style weather card: hero, 24h strip, daily list and detail tiles",
  preview: !1
});
export {
  w as FruityWeatherCard
};
